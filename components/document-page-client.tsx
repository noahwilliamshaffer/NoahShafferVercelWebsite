"use client"

import { useEffect } from 'react'
import { DocumentViewer } from '@/components/pdf-viewer/document-viewer'
import { usePDF } from '@/components/providers/pdf-provider'
import type { DocumentFile } from '@/lib/document-discovery'

interface DocumentPageClientProps {
  document: DocumentFile
  initialPage: number
}

export function DocumentPageClient({ document, initialPage }: DocumentPageClientProps) {
  const { loadPDF } = usePDF()

  useEffect(() => {
    loadPDF(document.path)
  }, [document.path, loadPDF])

  return (
    <DocumentViewer 
      documentSlug={document.slug}
      initialPage={initialPage}
    />
  )
}



