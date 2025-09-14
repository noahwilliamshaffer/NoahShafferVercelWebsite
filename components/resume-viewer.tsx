"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Download, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize, 
  Minimize,
  ChevronLeft,
  ChevronRight,
  Home,
  Menu,
  X
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { PDFProvider, usePDF } from "@/components/providers/pdf-provider"
import { DocumentViewer as PDFDocumentViewer } from "@/components/pdf-viewer/document-viewer"
import { SearchPanel } from "@/components/pdf-viewer/search-panel"
import { TableOfContents } from "@/components/pdf-viewer/table-of-contents"
import { DocumentFile } from "@/lib/document-discovery"
import Link from "next/link"

interface ResumeViewerProps {
  document: DocumentFile
}

function ViewerControls() {
  const { 
    currentPage, 
    documentInfo, 
    zoomLevel, 
    setZoom, 
    goToPage,
    search,
    isLoading 
  } = usePDF()
  
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [showSearch, setShowSearch] = React.useState(false)

  const handleSearch = React.useCallback((query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      search(query)
      setShowSearch(true)
    } else {
      setShowSearch(false)
    }
  }, [search])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = `/docs/resume.pdf`
    link.download = 'Resume.pdf'
    link.click()
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-16 bg-background/80 backdrop-blur-md border-b">
        <div className="animate-pulse text-muted-foreground">Loading PDF...</div>
      </div>
    )
  }

  return (
    <motion.div
      className="sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container flex items-center justify-between h-16 gap-4">
        {/* Left Controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/" aria-label="Back to home">
              <Home className="h-4 w-4" />
            </Link>
          </Button>

          {/* Page Navigation */}
          {documentInfo && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => goToPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-2 text-sm">
                <span>{currentPage}</span>
                <span className="text-muted-foreground">of</span>
                <span>{documentInfo.numPages}</span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => goToPage(Math.min(documentInfo.numPages, currentPage + 1))}
                disabled={currentPage >= documentInfo.numPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search in document..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(zoomLevel - 0.25)}
              disabled={zoomLevel <= 0.25}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <Badge variant="outline" className="min-w-[60px] justify-center">
              {Math.round(zoomLevel * 100)}%
            </Badge>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(zoomLevel + 0.25)}
              disabled={zoomLevel >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Additional Controls */}
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>

          <Button variant="ghost" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Document Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <TableOfContents />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search Results Panel */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t bg-muted/30"
          >
            <div className="container py-4">
              <SearchPanel query={searchQuery} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ResumeViewerContent({ document }: ResumeViewerProps) {
  const { loadPDF, error } = usePDF()

  React.useEffect(() => {
    loadPDF(document.path)
  }, [document.path, loadPDF])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold mb-2">Error Loading PDF</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <ViewerControls />
      
      <div className="flex">
        {/* Sidebar - Table of Contents */}
        <aside className="hidden lg:block w-80 border-r bg-muted/30">
          <div className="sticky top-32 p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <h3 className="font-semibold mb-4">Table of Contents</h3>
            <TableOfContents />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="p-6">
            <PDFDocumentViewer documentSlug={document.slug} />
          </div>
        </main>
      </div>
    </div>
  )
}

export function ResumeViewer({ document }: ResumeViewerProps) {
  return (
    <PDFProvider>
      <ResumeViewerContent document={document} />
    </PDFProvider>
  )
}
