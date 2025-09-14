import { promises as fs } from 'fs'
import path from 'path'
import { slugify } from './utils'

export interface DocumentFile {
  filename: string
  slug: string
  path: string
  size: number
  lastModified: Date
}

export async function getDocuments(): Promise<DocumentFile[]> {
  try {
    const docsDir = path.join(process.cwd(), 'public', 'docs')
    
    // Check if docs directory exists
    try {
      await fs.access(docsDir)
    } catch {
      // Directory doesn't exist, return empty array
      return []
    }

    const files = await fs.readdir(docsDir)
    const pdfFiles = files.filter(file => 
      file.toLowerCase().endsWith('.pdf') && !file.startsWith('.')
    )

    const documents: DocumentFile[] = []

    for (const filename of pdfFiles) {
      const filePath = path.join(docsDir, filename)
      const stats = await fs.stat(filePath)
      
      const nameWithoutExt = path.parse(filename).name
      const slug = slugify(nameWithoutExt)
      
      documents.push({
        filename,
        slug,
        path: `/docs/${filename}`,
        size: stats.size,
        lastModified: stats.mtime,
      })
    }

    // Sort by last modified date (newest first)
    documents.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())

    return documents
  } catch (error) {
    console.error('Error discovering documents:', error)
    return []
  }
}

export async function getDocumentBySlug(slug: string): Promise<DocumentFile | null> {
  const documents = await getDocuments()
  return documents.find(doc => doc.slug === slug) || null
}

export async function getDocumentMetadata(filePath: string) {
  try {
    // This would be used server-side to extract PDF metadata
    // For now, we'll return basic file info
    const fullPath = path.join(process.cwd(), 'public', filePath.replace(/^\//, ''))
    const stats = await fs.stat(fullPath)
    
    return {
      size: stats.size,
      lastModified: stats.mtime,
      filename: path.basename(fullPath),
    }
  } catch (error) {
    console.error('Error getting document metadata:', error)
    return null
  }
}



