"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Sparkles } from 'lucide-react'

interface AnimatedHeroProps {
  documentCount: number
}

export function AnimatedHero({ documentCount }: AnimatedHeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.25, 0, 1] }
    }
  }

  return (
    <section className="relative gradient-hero py-20 px-6">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      
      <motion.div 
        className="relative max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
        >
          <Sparkles className="w-4 h-4" />
          Document Collection
        </motion.div>
        
        <motion.h1 
          variants={itemVariants}
          className="text-4xl md:text-6xl font-bold font-display mb-6 text-gradient"
        >
          Beautiful Document Reading
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
        >
          Discover, search, and read PDF documents with a modern, 
          accessible interface designed for focus and clarity.
        </motion.p>
        
        <motion.div 
          variants={itemVariants}
          className="flex items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>{documentCount} document{documentCount !== 1 ? 's' : ''}</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}



