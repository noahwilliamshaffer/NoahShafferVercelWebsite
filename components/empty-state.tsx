"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Upload, Folder, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function EmptyState() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const steps = [
    {
      number: 1,
      icon: Folder,
      title: "Create docs folder",
      description: "Make sure you have a /public/docs/ folder in your project"
    },
    {
      number: 2,
      icon: Upload,
      title: "Add PDF files",
      description: "Drop your PDF documents into /public/docs/"
    },
    {
      number: 3,
      icon: FileText,
      title: "Deploy & view",
      description: "Redeploy your site and your documents will appear here"
    }
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-[60vh] flex items-center justify-center p-6"
    >
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
            <FileText className="w-10 h-10 text-muted-foreground" />
          </div>
          
          <h1 className="text-3xl font-bold font-display mb-4">
            No Documents Found
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            Get started by adding PDF files to your document collection
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid gap-6 md:grid-cols-3 mb-8"
        >
          {steps.map((step) => (
            <Card key={step.number} className="glass-card">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-base">
                  {step.number}. {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="space-y-4"
        >
          <Card className="glass-card p-6 text-left">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Folder className="w-5 h-5 text-primary" />
              Quick Start Guide
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="bg-muted/30 rounded-lg p-3 font-mono">
                <div className="text-muted-foreground mb-1"># Create the docs folder</div>
                <div>mkdir -p public/docs</div>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-3 font-mono">
                <div className="text-muted-foreground mb-1"># Add your PDF files</div>
                <div>cp your-document.pdf public/docs/</div>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-3 font-mono">
                <div className="text-muted-foreground mb-1"># Deploy to Vercel</div>
                <div>vercel --prod</div>
              </div>
            </div>
          </Card>

          <div className="flex justify-center gap-4">
            <Button variant="outline" asChild>
              <a
                href="https://vercel.com/docs"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Vercel Docs
              </a>
            </Button>
            
            <Button variant="outline" asChild>
              <a
                href="https://github.com/noahwilliamshaffer/NoahShafferVercelWebsite"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Source
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}



