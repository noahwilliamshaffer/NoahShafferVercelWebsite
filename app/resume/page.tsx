import React from 'react'
import { redirect } from 'next/navigation'
import { getDocuments } from '@/lib/document-discovery'
import { ResumeViewer } from '@/components/resume-viewer'

export const metadata = {
  title: 'Resume PDF | Noah Shaffer',
  description: 'View and download my professional resume in PDF format',
}

export default async function ResumePage() {
  const documents = await getDocuments()

  // Find resume.pdf specifically
  const resumeDoc = documents.find(doc => 
    doc.filename.toLowerCase() === 'resume.pdf' || 
    doc.slug === 'resume'
  )

  // If no resume found, redirect to main page
  if (!resumeDoc) {
    redirect('/')
  }

  return <ResumeViewer document={resumeDoc} />
}
