"use client"

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { PDFProcessor, PDFDocumentInfo, PDFPageInfo, TOCItem } from '@/lib/pdf-utils'
import { FlexSearch } from 'flexsearch'

export interface SearchResult {
  id: string
  pageNumber: number
  text: string
  context: string
  score: number
}

interface PDFState {
  processor: PDFProcessor | null
  documentInfo: PDFDocumentInfo | null
  pages: Map<number, PDFPageInfo>
  textContent: string
  tocItems: TOCItem[]
  searchIndex: FlexSearch.Document<any> | null
  isLoading: boolean
  isIndexing: boolean
  indexingProgress: number
  error: string | null
  currentPage: number
  zoomLevel: number
  viewMode: 'canvas' | 'reflow'
}

type PDFAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_INDEXING'; payload: { isIndexing: boolean; progress: number } }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DOCUMENT_INFO'; payload: PDFDocumentInfo }
  | { type: 'SET_TEXT_CONTENT'; payload: string }
  | { type: 'SET_TOC'; payload: TOCItem[] }
  | { type: 'SET_PAGE_INFO'; payload: PDFPageInfo }
  | { type: 'SET_SEARCH_INDEX'; payload: FlexSearch.Document<any> }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'SET_ZOOM_LEVEL'; payload: number }
  | { type: 'SET_VIEW_MODE'; payload: 'canvas' | 'reflow' }
  | { type: 'RESET' }

const initialState: PDFState = {
  processor: null,
  documentInfo: null,
  pages: new Map(),
  textContent: '',
  tocItems: [],
  searchIndex: null,
  isLoading: false,
  isIndexing: false,
  indexingProgress: 0,
  error: null,
  currentPage: 1,
  zoomLevel: 1.0,
  viewMode: 'canvas',
}

function pdfReducer(state: PDFState, action: PDFAction): PDFState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_INDEXING':
      return { 
        ...state, 
        isIndexing: action.payload.isIndexing, 
        indexingProgress: action.payload.progress 
      }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false, isIndexing: false }
    case 'SET_DOCUMENT_INFO':
      return { ...state, documentInfo: action.payload }
    case 'SET_TEXT_CONTENT':
      return { ...state, textContent: action.payload }
    case 'SET_TOC':
      return { ...state, tocItems: action.payload }
    case 'SET_PAGE_INFO':
      const newPages = new Map(state.pages)
      newPages.set(action.payload.pageNumber, action.payload)
      return { ...state, pages: newPages }
    case 'SET_SEARCH_INDEX':
      return { ...state, searchIndex: action.payload }
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload }
    case 'SET_ZOOM_LEVEL':
      return { ...state, zoomLevel: Math.max(0.1, Math.min(5.0, action.payload)) }
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload }
    case 'RESET':
      return { ...initialState, processor: new PDFProcessor() }
    default:
      return state
  }
}

interface PDFContextValue extends PDFState {
  loadPDF: (url: string) => Promise<void>
  loadPDFFromFile: (file: File) => Promise<void>
  getPageInfo: (pageNumber: number) => Promise<PDFPageInfo | null>
  search: (query: string) => SearchResult[]
  goToPage: (pageNumber: number) => void
  setZoom: (level: number) => void
  setViewMode: (mode: 'canvas' | 'reflow') => void
  reset: () => void
}

const PDFContext = createContext<PDFContextValue | null>(null)

export function PDFProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(pdfReducer, {
    ...initialState,
    processor: new PDFProcessor(),
  })

  const loadPDF = useCallback(async (url: string) => {
    if (!state.processor) return

    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      const documentInfo = await state.processor.loadFromUrl(url)
      dispatch({ type: 'SET_DOCUMENT_INFO', payload: documentInfo })

      // Start indexing in background
      dispatch({ type: 'SET_INDEXING', payload: { isIndexing: true, progress: 0 } })

      const textContent = await state.processor.extractAllText((progress) => {
        dispatch({ type: 'SET_INDEXING', payload: { isIndexing: true, progress } })
      })

      dispatch({ type: 'SET_TEXT_CONTENT', payload: textContent })

      // Build search index
      const searchIndex = new FlexSearch.Document({
        id: 'id',
        index: ['content'],
        store: ['pageNumber', 'content', 'context'],
      })

      // Index text by pages
      for (let i = 1; i <= documentInfo.numPages; i++) {
        const pageInfo = await state.processor.extractPageText(i)
        if (pageInfo) {
          dispatch({ type: 'SET_PAGE_INFO', payload: pageInfo })
          
          // Add to search index
          const words = pageInfo.textContent.split(/\s+/)
          const chunks = []
          for (let j = 0; j < words.length; j += 50) {
            const chunk = words.slice(j, j + 50).join(' ')
            chunks.push({
              id: `${i}-${j}`,
              pageNumber: i,
              content: chunk,
              context: words.slice(Math.max(0, j - 10), j + 60).join(' '),
            })
          }
          
          chunks.forEach(chunk => searchIndex.add(chunk))
        }
      }

      dispatch({ type: 'SET_SEARCH_INDEX', payload: searchIndex })

      // Generate TOC
      const tocItems = await state.processor.generateTOC()
      dispatch({ type: 'SET_TOC', payload: tocItems })

      dispatch({ type: 'SET_INDEXING', payload: { isIndexing: false, progress: 100 } })
      dispatch({ type: 'SET_LOADING', payload: false })
    } catch (error) {
      console.error('Error loading PDF:', error)
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load PDF' })
    }
  }, [state.processor])

  const loadPDFFromFile = useCallback(async (file: File) => {
    if (!state.processor) return

    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      const documentInfo = await state.processor.loadFromFile(file)
      dispatch({ type: 'SET_DOCUMENT_INFO', payload: documentInfo })

      // Similar indexing process as loadPDF
      dispatch({ type: 'SET_INDEXING', payload: { isIndexing: true, progress: 0 } })

      const textContent = await state.processor.extractAllText((progress) => {
        dispatch({ type: 'SET_INDEXING', payload: { isIndexing: true, progress } })
      })

      dispatch({ type: 'SET_TEXT_CONTENT', payload: textContent })

      const searchIndex = new FlexSearch.Document({
        id: 'id',
        index: ['content'],
        store: ['pageNumber', 'content', 'context'],
      })

      for (let i = 1; i <= documentInfo.numPages; i++) {
        const pageInfo = await state.processor.extractPageText(i)
        if (pageInfo) {
          dispatch({ type: 'SET_PAGE_INFO', payload: pageInfo })
          
          const words = pageInfo.textContent.split(/\s+/)
          const chunks = []
          for (let j = 0; j < words.length; j += 50) {
            const chunk = words.slice(j, j + 50).join(' ')
            chunks.push({
              id: `${i}-${j}`,
              pageNumber: i,
              content: chunk,
              context: words.slice(Math.max(0, j - 10), j + 60).join(' '),
            })
          }
          
          chunks.forEach(chunk => searchIndex.add(chunk))
        }
      }

      dispatch({ type: 'SET_SEARCH_INDEX', payload: searchIndex })

      const tocItems = await state.processor.generateTOC()
      dispatch({ type: 'SET_TOC', payload: tocItems })

      dispatch({ type: 'SET_INDEXING', payload: { isIndexing: false, progress: 100 } })
      dispatch({ type: 'SET_LOADING', payload: false })
    } catch (error) {
      console.error('Error loading PDF:', error)
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load PDF' })
    }
  }, [state.processor])

  const getPageInfo = useCallback(async (pageNumber: number): Promise<PDFPageInfo | null> => {
    if (!state.processor) return null
    
    if (state.pages.has(pageNumber)) {
      return state.pages.get(pageNumber)!
    }

    try {
      const pageInfo = await state.processor.extractPageText(pageNumber)
      if (pageInfo) {
        dispatch({ type: 'SET_PAGE_INFO', payload: pageInfo })
      }
      return pageInfo
    } catch (error) {
      console.error(`Error getting page ${pageNumber}:`, error)
      return null
    }
  }, [state.processor, state.pages])

  const search = useCallback((query: string): SearchResult[] => {
    if (!state.searchIndex || !query.trim()) return []

    try {
      const results = state.searchIndex.search(query, { limit: 50 })
      return results.flatMap((result: any) => 
        result.result.map((item: any) => ({
          id: item.id,
          pageNumber: item.pageNumber,
          text: item.content,
          context: item.context,
          score: 1, // FlexSearch doesn't provide scores in this format
        }))
      )
    } catch (error) {
      console.error('Search error:', error)
      return []
    }
  }, [state.searchIndex])

  const goToPage = useCallback((pageNumber: number) => {
    if (state.documentInfo && pageNumber >= 1 && pageNumber <= state.documentInfo.numPages) {
      dispatch({ type: 'SET_CURRENT_PAGE', payload: pageNumber })
    }
  }, [state.documentInfo])

  const setZoom = useCallback((level: number) => {
    dispatch({ type: 'SET_ZOOM_LEVEL', payload: level })
  }, [])

  const setViewMode = useCallback((mode: 'canvas' | 'reflow') => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode })
  }, [])

  const reset = useCallback(() => {
    if (state.processor) {
      state.processor.destroy()
    }
    dispatch({ type: 'RESET' })
  }, [state.processor])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (state.processor) {
        state.processor.destroy()
      }
    }
  }, [state.processor])

  const contextValue: PDFContextValue = {
    ...state,
    loadPDF,
    loadPDFFromFile,
    getPageInfo,
    search,
    goToPage,
    setZoom,
    setViewMode,
    reset,
  }

  return (
    <PDFContext.Provider value={contextValue}>
      {children}
    </PDFContext.Provider>
  )
}

export function usePDF() {
  const context = useContext(PDFContext)
  if (!context) {
    throw new Error('usePDF must be used within a PDFProvider')
  }
  return context
}



