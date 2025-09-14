"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ExternalLink, Github, Code, Lightbulb } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ParsedProject } from "@/lib/resume-parser"

interface ProjectsSectionProps {
  projects: ParsedProject[]
  className?: string
}

export function ProjectsSection({ projects, className }: ProjectsSectionProps) {
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

  const headerVariants = {
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

  if (!projects || projects.length === 0) {
    return null
  }

  return (
    <section id="projects" className={`py-20 ${className}`}>
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section Header */}
          <motion.div variants={headerVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A showcase of notable projects, innovations, and technical achievements
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="h-full glass-card hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Code className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {project.title}
                        </CardTitle>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {project.github && (
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="h-8 w-8"
                          >
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="View source code"
                            >
                              <Github className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        
                        {project.url && (
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="h-8 w-8"
                          >
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="View live project"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-4">
                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>

                    {/* Highlights */}
                    {project.highlights && project.highlights.length > 0 && (
                      <ul className="space-y-1">
                        {project.highlights.slice(0, 3).map((highlight, highlightIndex) => (
                          <li key={highlightIndex} className="flex items-start gap-2 text-xs">
                            <Lightbulb className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground leading-relaxed">
                              {highlight}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.technologies.slice(0, 6).map((tech, techIndex) => (
                          <Badge
                            key={techIndex}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 6 && (
                          <Badge
                            variant="outline"
                            className="text-xs text-muted-foreground"
                          >
                            +{project.technologies.length - 6} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Show More Projects Link */}
          {projects.length > 6 && (
            <motion.div
              variants={headerVariants}
              className="text-center mt-12"
            >
              <Button variant="outline" size="lg" className="group">
                View All Projects
                <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}

          {/* Background Decorations */}
          <div className="absolute -z-10">
            <motion.div
              className="absolute top-32 left-20 w-16 h-16 rounded-full bg-primary/5 blur-xl"
              animate={{
                y: [-15, 15, -15],
                x: [-5, 5, -5],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <motion.div
              className="absolute bottom-32 right-20 w-24 h-24 rounded-full bg-secondary/5 blur-xl"
              animate={{
                y: [15, -15, 15],
                x: [5, -5, 5],
              }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
