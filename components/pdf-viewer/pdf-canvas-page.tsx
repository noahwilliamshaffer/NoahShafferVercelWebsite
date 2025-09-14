"use client"

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { usePDF } from '@/components/providers/pdf-provider'
import type { PDFPageProxy } from 'pdfjs-dist/types/src/display/api'

interface PDFCanvasPageProps {
  pageNumber: number
  scale?: number
  className?: string
  onPageLoad?: (pageNumber: number) => void
}

export function PDFCanvasPage({ 
  pageNumber, 
  scale = 1.0, 
  className = '',
  onPageLoad 
}: PDFCanvasPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const renderTaskRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  
  const { processor, zoomLevel } = usePDF()

  const renderPage = useCallback(async () => {
    if (!processor || !canvasRef.current) return

    try {
      setIsLoading(true)
      setError(null)

      const page = await processor.getPage(pageNumber)
      if (!page) {
        throw new Error(`Failed to load page ${pageNumber}`)
      }

      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      if (!context) {
        throw new Error('Could not get canvas context')
      }

      const actualScale = scale * zoomLevel
      const viewport = page.getViewport({ scale: actualScale })

      // Set canvas dimensions
      canvas.height = viewport.height
      canvas.width = viewport.width
      
      setDimensions({ width: viewport.width, height: viewport.height })

      // Cancel previous render task if it exists
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel()
      }

      // Render the page
      renderTaskRef.current = page.render({
        canvasContext: context,
        viewport: viewport,
      })

      await renderTaskRef.current.promise
      
      setIsLoading(false)
      onPageLoad?.(pageNumber)
    } catch (error: any) {
      if (error?.name !== 'RenderingCancelledException') {
        console.error(`Error rendering page ${pageNumber}:`, error)
        setError(error.message || 'Failed to render page')
        setIsLoading(false)
      }
    }
  }, [processor, pageNumber, scale, zoomLevel, onPageLoad])

  useEffect(() => {
    renderPage()

    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel()
      }
    }
  }, [renderPage])

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center justify-center p-8 rounded-lg border border-destructive/20 bg-destructive/5 ${className}`}
      >
        <div className="text-center">
          <p className="text-destructive font-medium mb-2">
            Failed to load page {pageNumber}
          </p>
          <p className="text-sm text-muted-foreground">
            {error}
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative ${className}`}
    >
      {/* Page number indicator */}
      <div className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm border rounded-full px-3 py-1 text-sm font-medium shadow-sm">
        {pageNumber}
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-background rounded-lg p-4">
            <Skeleton className="w-[600px] h-[800px] max-w-full" />
          </div>
        </div>
      )}

      <div className="pdf-page-shadow rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className={`block max-w-full h-auto ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
          style={{
            width: dimensions.width > 0 ? `${dimensions.width}px` : 'auto',
            height: dimensions.height > 0 ? `${dimensions.height}px` : 'auto',
          }}
        />
      </div>
    </motion.div>
  )
}



