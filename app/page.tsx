import React from 'react'
import { redirect } from 'next/navigation'
import { getDocuments } from '@/lib/document-discovery'
import { DocumentCard } from '@/components/document-card'
import { EmptyState } from '@/components/empty-state'
import { ResumeHomePage } from '@/components/resume-home-page'

export const metadata = {
  title: 'Document Viewer | Noah Shaffer',
  description: 'Browse and read PDF documents with a beautiful, fast interface',
}

export default async function HomePage() {
  const documents = await getDocuments()

  // Check for resume.pdf specifically
  const resumeDoc = documents.find(doc => 
    doc.filename.toLowerCase() === 'resume.pdf' || 
    doc.slug === 'resume'
  )

  // If resume.pdf exists, show the premium resume experience
  if (resumeDoc) {
    return <ResumeHomePage resumeDocument={resumeDoc} />
  }

  // If only one document and it's not a resume, redirect to it
  if (documents.length === 1) {
    redirect(`/${documents[0].slug}`)
  }

  // If no documents, show empty state with resume instructions
  if (documents.length === 0) {
    return <EmptyState />
  }

  // Multiple documents - show document browser (fallback behavior)
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">
            Document <span className="text-gradient">Library</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Browse and read PDF documents with advanced features
          </p>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              Available Documents
            </h2>
            <p className="text-muted-foreground">
              Click on any document to start reading with advanced features like 
              full-text search, table of contents, and multiple viewing modes.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((document, index) => (
              <DocumentCard
                key={document.slug}
                document={document}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            Built with Next.js, Tailwind CSS, and PDF.js
          </p>
        </div>
      </footer>
    </div>
  )
}
