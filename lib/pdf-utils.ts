import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy, PDFPageProxy, TextItem } from 'pdfjs-dist/types/src/display/api'

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
}

export interface PDFMetadata {
  title?: string
  author?: string
  subject?: string
  creator?: string
  producer?: string
  creationDate?: Date
  modificationDate?: Date
  keywords?: string
}

export interface PDFPageInfo {
  pageNumber: number
  width: number
  height: number
  textContent: string
  textItems: TextItem[]
}

export interface PDFDocumentInfo {
  metadata: PDFMetadata
  numPages: number
  fileSize?: number
  fingerprint: string
}

export interface TOCItem {
  title: string
  level: number
  pageNumber: number
  fontSize?: number
  fontWeight?: string
  id: string
}

export interface SearchResult {
  pageNumber: number
  text: string
  context: string
  position: { x: number; y: number }
}

export class PDFProcessor {
  private document: PDFDocumentProxy | null = null
  private pages: Map<number, PDFPageInfo> = new Map()
  private textContent: string = ''
  private tocItems: TOCItem[] = []

  async loadFromUrl(url: string): Promise<PDFDocumentInfo> {
    try {
      const loadingTask = pdfjsLib.getDocument({
        url,
        cMapUrl: '/cmaps/',
        cMapPacked: true,
      })
      
      this.document = await loadingTask.promise
      
      const metadata = await this.extractMetadata()
      const info: PDFDocumentInfo = {
        metadata,
        numPages: this.document.numPages,
        fingerprint: this.document.fingerprints[0] || '',
      }

      return info
    } catch (error) {
      console.error('Error loading PDF:', error)
      throw new Error('Failed to load PDF document')
    }
  }

  async loadFromFile(file: File): Promise<PDFDocumentInfo> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        cMapUrl: '/cmaps/',
        cMapPacked: true,
      })
      
      this.document = await loadingTask.promise
      
      const metadata = await this.extractMetadata()
      const info: PDFDocumentInfo = {
        metadata,
        numPages: this.document.numPages,
        fileSize: file.size,
        fingerprint: this.document.fingerprints[0] || '',
      }

      return info
    } catch (error) {
      console.error('Error loading PDF:', error)
      throw new Error('Failed to load PDF document')
    }
  }

  private async extractMetadata(): Promise<PDFMetadata> {
    if (!this.document) return {}

    try {
      const metadata = await this.document.getMetadata()
      const info = metadata.info
      
      return {
        title: info.Title || undefined,
        author: info.Author || undefined,
        subject: info.Subject || undefined,
        creator: info.Creator || undefined,
        producer: info.Producer || undefined,
        creationDate: info.CreationDate ? new Date(info.CreationDate) : undefined,
        modificationDate: info.ModDate ? new Date(info.ModDate) : undefined,
        keywords: info.Keywords || undefined,
      }
    } catch (error) {
      console.error('Error extracting metadata:', error)
      return {}
    }
  }

  async getPage(pageNumber: number): Promise<PDFPageProxy | null> {
    if (!this.document || pageNumber < 1 || pageNumber > this.document.numPages) {
      return null
    }

    try {
      return await this.document.getPage(pageNumber)
    } catch (error) {
      console.error(`Error loading page ${pageNumber}:`, error)
      return null
    }
  }

  async extractPageText(pageNumber: number): Promise<PDFPageInfo | null> {
    if (this.pages.has(pageNumber)) {
      return this.pages.get(pageNumber)!
    }

    const page = await this.getPage(pageNumber)
    if (!page) return null

    try {
      const textContent = await page.getTextContent()
      const viewport = page.getViewport({ scale: 1.0 })
      
      const textItems = textContent.items as TextItem[]
      const pageText = textItems
        .map(item => item.str)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()

      const pageInfo: PDFPageInfo = {
        pageNumber,
        width: viewport.width,
        height: viewport.height,
        textContent: pageText,
        textItems,
      }

      this.pages.set(pageNumber, pageInfo)
      return pageInfo
    } catch (error) {
      console.error(`Error extracting text from page ${pageNumber}:`, error)
      return null
    }
  }

  async extractAllText(progressCallback?: (progress: number) => void): Promise<string> {
    if (!this.document) return ''
    
    const textParts: string[] = []
    const numPages = this.document.numPages

    for (let i = 1; i <= numPages; i++) {
      const pageInfo = await this.extractPageText(i)
      if (pageInfo) {
        textParts.push(pageInfo.textContent)
      }
      
      if (progressCallback) {
        progressCallback((i / numPages) * 100)
      }
    }

    this.textContent = textParts.join('\n\n')
    return this.textContent
  }

  async generateTOC(): Promise<TOCItem[]> {
    if (!this.document) return []
    
    const tocItems: TOCItem[] = []
    const numPages = this.document.numPages

    // Try to get outline first
    try {
      const outline = await this.document.getOutline()
      if (outline && outline.length > 0) {
        const processOutlineItems = (items: any[], level = 1) => {
          for (const item of items) {
            if (item.dest) {
              // Try to resolve destination to page number
              // This is simplified - in practice, you'd need to resolve the destination
              tocItems.push({
                title: item.title,
                level,
                pageNumber: 1, // Placeholder - would need proper destination resolution
                id: `toc-${tocItems.length}`,
              })
            }
            
            if (item.items && item.items.length > 0) {
              processOutlineItems(item.items, level + 1)
            }
          }
        }
        
        processOutlineItems(outline)
      }
    } catch (error) {
      console.error('Error extracting outline:', error)
    }

    // If no outline or outline failed, generate TOC from text analysis
    if (tocItems.length === 0) {
      for (let i = 1; i <= Math.min(numPages, 10); i++) { // Limit to first 10 pages for performance
        const pageInfo = await this.extractPageText(i)
        if (!pageInfo) continue

        // Analyze text items for potential headings
        const headings = this.extractHeadingsFromTextItems(pageInfo.textItems, i)
        tocItems.push(...headings)
      }
    }

    this.tocItems = tocItems
    return tocItems
  }

  private extractHeadingsFromTextItems(textItems: TextItem[], pageNumber: number): TOCItem[] {
    const headings: TOCItem[] = []
    const avgFontSize = this.calculateAverageFontSize(textItems)
    
    for (let i = 0; i < textItems.length; i++) {
      const item = textItems[i]
      const fontSize = this.getFontSize(item)
      
      // Potential heading criteria
      const isLargerFont = fontSize > avgFontSize * 1.2
      const isShortText = item.str.trim().length < 100
      const isNotAllCaps = item.str !== item.str.toUpperCase()
      const hasHeadingKeywords = /^(chapter|section|part|\d+\.|\d+\.\d+)/i.test(item.str.trim())
      
      if ((isLargerFont || hasHeadingKeywords) && isShortText && isNotAllCaps && item.str.trim().length > 3) {
        const level = this.determineLevelFromFontSize(fontSize, avgFontSize)
        
        headings.push({
          title: item.str.trim(),
          level,
          pageNumber,
          fontSize,
          id: `heading-${pageNumber}-${i}`,
        })
      }
    }

    return headings
  }

  private getFontSize(textItem: TextItem): number {
    // Extract font size from transform matrix or height
    if ('height' in textItem) {
      return textItem.height as number
    }
    
    // Fallback: estimate from transform matrix
    const transform = (textItem as any).transform
    if (transform && transform.length >= 4) {
      return Math.abs(transform[3]) || 12
    }
    
    return 12 // Default font size
  }

  private calculateAverageFontSize(textItems: TextItem[]): number {
    if (textItems.length === 0) return 12
    
    const fontSizes = textItems.map(item => this.getFontSize(item))
    return fontSizes.reduce((sum, size) => sum + size, 0) / fontSizes.length
  }

  private determineLevelFromFontSize(fontSize: number, avgFontSize: number): number {
    const ratio = fontSize / avgFontSize
    
    if (ratio >= 1.8) return 1
    if (ratio >= 1.4) return 2
    if (ratio >= 1.2) return 3
    return 4
  }

  getDocument(): PDFDocumentProxy | null {
    return this.document
  }

  getTextContent(): string {
    return this.textContent
  }

  getTOC(): TOCItem[] {
    return this.tocItems
  }

  destroy(): void {
    if (this.document) {
      this.document.destroy()
      this.document = null
    }
    this.pages.clear()
    this.textContent = ''
    this.tocItems = []
  }
}

