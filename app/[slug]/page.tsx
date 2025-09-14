import React from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { PDFProvider } from '@/components/providers/pdf-provider'
import { DocumentPageClient } from '@/components/document-page-client'
import { getDocumentBySlug, getDocuments } from '@/lib/document-discovery'
import { parsePageFromUrl } from '@/lib/utils'

interface DocumentPageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateStaticParams() {
  const documents = await getDocuments()
  return documents.map((doc) => ({
    slug: doc.slug,
  }))
}

export async function generateMetadata({ params }: DocumentPageProps): Promise<Metadata> {
  const document = await getDocumentBySlug(params.slug)
  
  if (!document) {
    return {
      title: 'Document Not Found',
      description: 'The requested document could not be found.',
    }
  }

  const title = document.filename.replace('.pdf', '')
  
  return {
    title: `${title} | Document Viewer`,
    description: `Read and search through ${title} with advanced PDF viewing features.`,
    openGraph: {
      title: `${title} | Document Viewer`,
      description: `Read and search through ${title} with advanced PDF viewing features.`,
      type: 'article',
      url: `/${document.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Document Viewer`,
      description: `Read and search through ${title} with advanced PDF viewing features.`,
    },
  }
}

export default async function DocumentPage({ params, searchParams }: DocumentPageProps) {
  const document = await getDocumentBySlug(params.slug)
  
  if (!document) {
    notFound()
  }

  const initialPage = parsePageFromUrl(new URLSearchParams(searchParams as Record<string, string>))

  return (
    <PDFProvider>
      <DocumentPageClient 
        document={document}
        initialPage={initialPage}
      />
    </PDFProvider>
  )
}
