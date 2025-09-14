import { MetadataRoute } from 'next'
import { getDocuments } from '@/lib/document-discovery'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000'

  const documents = await getDocuments()

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  // Add document pages
  documents.forEach((doc) => {
    routes.push({
      url: `${baseUrl}/${doc.slug}`,
      lastModified: doc.lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  })

  return routes
}



