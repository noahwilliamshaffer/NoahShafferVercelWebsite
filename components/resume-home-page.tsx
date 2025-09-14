"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { HeroSection } from "@/components/sections/hero-section"
import { HighlightsSection } from "@/components/sections/highlights-section"
import { SkillsSection } from "@/components/sections/skills-section"
import { ExperienceSection } from "@/components/sections/experience-section"
import { ProjectsSection } from "@/components/sections/projects-section"
import { EducationSection } from "@/components/sections/education-section"
import { ResumeParser, ParsedResume } from "@/lib/resume-parser"
import { DocumentFile } from "@/lib/document-discovery"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, FileText } from "lucide-react"

interface ResumeHomePageProps {
  resumeDocument: DocumentFile
}

// Default fallback content
const defaultContent: ParsedResume = {
  contact: {
    name: "Professional",
    email: "",
    phone: "",
    location: "",
  },
  summary: "Experienced professional with a passion for excellence and innovation.",
  highlights: [
    "Proven track record of delivering high-quality results",
    "Strong analytical and problem-solving skills",
    "Excellent communication and collaboration abilities",
  ],
  skills: [
    { name: "Leadership", category: "soft" },
    { name: "Project Management", category: "soft" },
    { name: "Strategic Planning", category: "soft" },
  ],
  experience: [],
  projects: [],
  education: [],
  certifications: [],
  keywords: [],
}

function LoadingSkeleton() {
  return (
    <div className="space-y-20">
      {/* Hero Skeleton */}
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-6">
          <Skeleton className="h-16 w-96 mx-auto" />
          <Skeleton className="h-6 w-80 mx-auto" />
          <div className="flex gap-4 justify-center">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      {/* Content Skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="container">
          <Skeleton className="h-12 w-64 mx-auto mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((j) => (
              <Card key={j} className="glass-card">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-full mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Error Loading Resume</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-sm text-left">
          <h3 className="font-semibold mb-2">Troubleshooting:</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Ensure your PDF file is not corrupted</li>
            <li>Check that the file is accessible at the expected path</li>
            <li>Try refreshing the page</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export function ResumeHomePage({ resumeDocument }: ResumeHomePageProps) {
  const [resumeData, setResumeData] = React.useState<ParsedResume | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function loadResume() {
      try {
        setIsLoading(true)
        setError(null)

        // Try to load overrides first
        let overrides = {}
        try {
          const overridesResponse = await fetch('/content/overrides.json')
          if (overridesResponse.ok) {
            const overridesText = await overridesResponse.text()
            if (overridesText.trim()) {
              overrides = JSON.parse(overridesText)
            }
          }
        } catch (err) {
          console.log('No overrides found, using parsed content')
        }

        // Parse the resume PDF
        const parser = new ResumeParser()
        let parsedData: ParsedResume

        try {
          parsedData = await parser.parseFromUrl(resumeDocument.path)
        } catch (err) {
          console.error('Error parsing resume:', err)
          // Use default content with name from document
          parsedData = {
            ...defaultContent,
            contact: {
              ...defaultContent.contact,
              name: resumeDocument.filename.replace('.pdf', '').replace(/[-_]/g, ' '),
            }
          }
        }

        // Merge with overrides
        const finalData = {
          ...parsedData,
          ...overrides,
          contact: { ...parsedData.contact, ...overrides.contact },
          skills: overrides.skills || parsedData.skills,
          experience: overrides.experience || parsedData.experience,
          projects: overrides.projects || parsedData.projects,
          education: overrides.education || parsedData.education,
          certifications: overrides.certifications || parsedData.certifications,
        }

        setResumeData(finalData)
        parser.destroy()
      } catch (err) {
        console.error('Error loading resume:', err)
        setError(err instanceof Error ? err.message : 'Failed to load resume')
      } finally {
        setIsLoading(false)
      }
    }

    loadResume()
  }, [resumeDocument])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  if (!resumeData) {
    return <ErrorState error="No resume data available" />
  }

  return (
    <main id="main-content" className="min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <HeroSection 
          contact={resumeData.contact}
          summary={resumeData.summary}
        />
        
        {resumeData.highlights.length > 0 && (
          <HighlightsSection highlights={resumeData.highlights} />
        )}
        
        {resumeData.skills.length > 0 && (
          <SkillsSection skills={resumeData.skills} />
        )}
        
        {resumeData.experience.length > 0 && (
          <ExperienceSection experience={resumeData.experience} />
        )}
        
        {resumeData.projects.length > 0 && (
          <ProjectsSection projects={resumeData.projects} />
        )}
        
        {(resumeData.education.length > 0 || resumeData.certifications.length > 0) && (
          <EducationSection 
            education={resumeData.education}
            certifications={resumeData.certifications}
          />
        )}
      </motion.div>
    </main>
  )
}
