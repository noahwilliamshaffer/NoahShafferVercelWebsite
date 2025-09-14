"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, Calendar, HardDrive, Eye, Download } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatFileSize, formatDate } from '@/lib/utils'
import type { DocumentFile } from '@/lib/document-discovery'

interface DocumentCardProps {
  document: DocumentFile
  index: number
}

export function DocumentCard({ document, index }: DocumentCardProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [metadata, setMetadata] = useState<{
    title?: string
    author?: string
    pageCount?: number
  } | null>(null)

  // Generate thumbnail and extract metadata
  useEffect(() => {
    let mounted = true

    const loadMetadata = async () => {
      try {
        // Import PDF.js dynamically to avoid SSR issues
        const pdfjsLib = await import('pdfjs-dist')
        
        if (typeof window !== 'undefined') {
          pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
        }

        const loadingTask = pdfjsLib.getDocument(document.path)
        const pdf = await loadingTask.promise

        if (!mounted) return

        // Extract basic metadata
        try {
          const metadata = await pdf.getMetadata()
          const info = metadata.info
          
          if (mounted) {
            setMetadata({
              title: info.Title || document.filename.replace('.pdf', ''),
              author: info.Author || undefined,
              pageCount: pdf.numPages,
            })
          }
        } catch (error) {
          console.error('Error extracting metadata:', error)
          if (mounted) {
            setMetadata({
              title: document.filename.replace('.pdf', ''),
              pageCount: pdf.numPages,
            })
          }
        }

        // Generate thumbnail from first page
        try {
          const page = await pdf.getPage(1)
          const scale = 0.3
          const viewport = page.getViewport({ scale })

          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          
          if (context) {
            canvas.height = viewport.height
            canvas.width = viewport.width

            await page.render({
              canvasContext: context,
              viewport: viewport,
            }).promise

            if (mounted) {
              setThumbnailUrl(canvas.toDataURL())
            }
          }
        } catch (error) {
          console.error('Error generating thumbnail:', error)
        }

        pdf.destroy()
      } catch (error) {
        console.error('Error loading PDF for card:', error)
        if (mounted) {
          setMetadata({
            title: document.filename.replace('.pdf', ''),
          })
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadMetadata()

    return () => {
      mounted = false
    }
  }, [document])

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.25, 0.25, 0, 1]
      }
    },
    hover: {
      y: -4,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.25, 0, 1]
      }
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group"
    >
      <Card className="glass-card h-full overflow-hidden transition-all duration-200 hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="relative flex-shrink-0 w-16 h-20 rounded-md overflow-hidden bg-muted/50">
              {isLoading ? (
                <Skeleton className="w-full h-full" />
              ) : thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={`${metadata?.title || document.filename} thumbnail`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {isLoading ? (
                  <Skeleton className="h-5 w-full mb-1" />
                ) : (
                  metadata?.title || document.filename.replace('.pdf', '')
                )}
              </CardTitle>
              
              {metadata?.author && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  by {metadata.author}
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              <span>{formatFileSize(document.size)}</span>
              {metadata?.pageCount && (
                <>
                  <span>•</span>
                  <span>{metadata.pageCount} pages</span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(document.lastModified)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/${document.slug}`}>
              <Eye className="w-4 h-4 mr-2" />
              Open
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            asChild
          >
            <a 
              href={document.path}
              download={document.filename}
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="w-4 h-4" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}



