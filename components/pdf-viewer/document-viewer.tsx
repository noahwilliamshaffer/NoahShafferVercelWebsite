"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Virtuoso } from 'react-virtuoso'
import { 
  Menu, 
  X, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Share, 
  Eye, 
  FileText,
  Sun,
  Moon,
  Monitor,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'

import { PDFCanvasPage } from './pdf-canvas-page'
import { TableOfContents } from './table-of-contents'
import { SearchPanel } from './search-panel'
import { usePDF } from '@/components/providers/pdf-provider'
import { copyToClipboard, generatePageUrl } from '@/lib/utils'

interface DocumentViewerProps {
  documentSlug: string
  initialPage?: number
}

export function DocumentViewer({ documentSlug, initialPage = 1 }: DocumentViewerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'toc' | 'search'>('toc')
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set())
  
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  
  const {
    documentInfo,
    currentPage,
    zoomLevel,
    viewMode,
    isLoading,
    error,
    goToPage,
    setZoom,
    setViewMode
  } = usePDF()

  // Set initial page
  useEffect(() => {
    if (initialPage !== currentPage) {
      goToPage(initialPage)
    }
  }, [initialPage, currentPage, goToPage])

  const handlePageLoad = useCallback((pageNumber: number) => {
    setLoadedPages(prev => new Set([...prev, pageNumber]))
  }, [])

  const handleTOCItemClick = useCallback((pageNumber: number) => {
    goToPage(pageNumber)
    // Scroll to page in virtualized list
    // This would need to be implemented with Virtuoso's scrollToIndex
  }, [goToPage])

  const handleSearchResultClick = useCallback((pageNumber: number) => {
    goToPage(pageNumber)
    setActiveTab('toc') // Switch back to TOC after search
  }, [goToPage])

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}${generatePageUrl(documentSlug, currentPage)}`
    const success = await copyToClipboard(url)
    
    toast({
      title: success ? "Link copied!" : "Failed to copy",
      description: success 
        ? "Page link copied to clipboard" 
        : "Please copy the link manually",
      variant: success ? "default" : "destructive",
    })
  }, [documentSlug, currentPage, toast])

  const handleDownload = useCallback(() => {
    const link = document.createElement('a')
    link.href = `/docs/${documentSlug}.pdf`
    link.download = `${documentInfo?.metadata.title || documentSlug}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [documentSlug, documentInfo])

  const handleZoomIn = () => setZoom(zoomLevel + 0.25)
  const handleZoomOut = () => setZoom(zoomLevel - 0.25)

  const handlePrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (documentInfo && currentPage < documentInfo.numPages) {
      goToPage(currentPage + 1)
    }
  }

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor
  }

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system'] as const
    const currentIndex = themes.indexOf(theme as any)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    setTheme(nextTheme)
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <FileText className="w-16 h-16 mx-auto mb-4 text-destructive" />
          <h1 className="text-2xl font-bold mb-2">Failed to load document</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild>
            <Link href="/">← Back to Documents</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading || !documentInfo) {
    return (
      <div className="min-h-screen">
        {/* Loading header */}
        <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-6 w-48" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        </header>

        {/* Loading content */}
        <div className="flex h-[calc(100vh-73px)]">
          <div className="w-80 border-r bg-muted/30 p-4">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Skeleton className="w-[600px] h-[800px]" />
          </div>
        </div>
      </div>
    )
  }

  const ThemeIcon = themeIcons[theme as keyof typeof themeIcons] || Monitor

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>

            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Documents
              </Link>
            </Button>

            <div className="hidden sm:block">
              <h1 className="font-semibold text-lg line-clamp-1">
                {documentInfo.metadata.title || documentSlug}
              </h1>
              {documentInfo.metadata.author && (
                <p className="text-sm text-muted-foreground">
                  by {documentInfo.metadata.author}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Page navigation */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <span className="text-sm font-medium px-3 py-1 bg-muted rounded-md">
                {currentPage} / {documentInfo.numPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= documentInfo.numPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Zoom controls */}
            <div className="hidden sm:flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.1}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              
              <span className="text-sm font-medium px-2 py-1 bg-muted rounded text-center min-w-[4rem]">
                {Math.round(zoomLevel * 100)}%
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 5.0}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            {/* Actions */}
            <Button variant="outline" size="sm" onClick={cycleTheme}>
              <ThemeIcon className="w-4 h-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share className="w-4 h-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-r bg-muted/30 overflow-hidden flex-shrink-0"
            >
              <div className="h-full flex flex-col">
                {/* Sidebar tabs */}
                <div className="flex border-b">
                  <Button
                    variant={activeTab === 'toc' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('toc')}
                    className="flex-1 rounded-none"
                  >
                    Contents
                  </Button>
                  <Button
                    variant={activeTab === 'search' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('search')}
                    className="flex-1 rounded-none"
                  >
                    Search
                  </Button>
                </div>

                {/* Sidebar content */}
                <div className="flex-1 overflow-hidden">
                  {activeTab === 'toc' ? (
                    <TableOfContents onItemClick={handleTOCItemClick} />
                  ) : (
                    <SearchPanel onResultClick={handleSearchResultClick} />
                  )}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full">
            <Virtuoso
              totalCount={documentInfo.numPages}
              itemContent={(index) => {
                const pageNumber = index + 1
                return (
                  <div className="p-6 flex justify-center">
                    <PDFCanvasPage
                      pageNumber={pageNumber}
                      onPageLoad={handlePageLoad}
                      className="max-w-full"
                    />
                  </div>
                )
              }}
              className="h-full"
            />
          </div>
        </main>
      </div>
    </div>
  )
}



