"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Download, Mail, MapPin, ExternalLink, Github, Linkedin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ParsedContact } from "@/lib/resume-parser"

interface HeroSectionProps {
  contact: ParsedContact
  summary: string
  className?: string
}

export function HeroSection({ contact, summary, className }: HeroSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.25, 0, 1],
      },
    },
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  }

  const handleDownloadResume = () => {
    // Try to find resume.pdf first, fallback to any PDF in docs
    const link = document.createElement('a')
    link.href = '/docs/resume.pdf'
    link.download = `${contact.name.replace(/\s+/g, '_')}_Resume.pdf`
    link.click()
  }

  const handleContact = () => {
    if (contact.email) {
      window.location.href = `mailto:${contact.email}`
    }
  }

  return (
    <section className={`relative min-h-[80vh] flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background Elements */}
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Floating Decorative Elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/10 blur-xl"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-secondary/10 blur-xl"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 2 }}
      />
      <motion.div
        className="absolute top-1/3 right-20 w-16 h-16 rounded-full bg-accent/20 blur-lg"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 4 }}
      />

      <div className="container relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Name and Title */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="text-gradient">{contact.name}</span>
            </h1>
            
            {summary && (
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {summary}
              </p>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-muted-foreground"
          >
            {contact.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{contact.location}</span>
              </div>
            )}
            
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>{contact.email}</span>
              </a>
            )}
          </motion.div>

          {/* Social Links */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 mt-6"
          >
            {contact.linkedin && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:scale-110 transition-transform"
              >
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            )}
            
            {contact.github && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:scale-110 transition-transform"
              >
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Button>
            )}
            
            {contact.website && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:scale-110 transition-transform"
              >
                <a
                  href={contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Personal Website"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Button>
            )}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <Button
              size="lg"
              onClick={handleDownloadResume}
              className="group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Download className="h-4 w-4 group-hover:animate-bounce" />
                Download Resume
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleContact}
              className="group"
            >
              <Mail className="h-4 w-4 mr-2 group-hover:animate-pulse" />
              Get In Touch
            </Button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            variants={itemVariants}
            className="mt-16"
          >
            <motion.div
              className="mx-auto w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <p className="text-xs text-muted-foreground mt-2">Scroll to explore</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
