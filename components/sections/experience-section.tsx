"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Building, Calendar, MapPin, ExternalLink } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ParsedExperience } from "@/lib/resume-parser"

interface ExperienceSectionProps {
  experience: ParsedExperience[]
  className?: string
}

export function ExperienceSection({ experience, className }: ExperienceSectionProps) {
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
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

  if (!experience || experience.length === 0) {
    return null
  }

  const formatDateRange = (startDate: string, endDate: string, current: boolean) => {
    if (current || endDate.toLowerCase().includes('present')) {
      return `${startDate} - Present`
    }
    return `${startDate} - ${endDate}`
  }

  return (
    <section id="experience" className={`py-20 ${className}`}>
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
              Professional <span className="text-gradient">Experience</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A timeline of roles, responsibilities, and key achievements throughout my career
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border transform md:-translate-x-px" />

            <div className="space-y-12">
              {experience.map((exp, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-col md:gap-8`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background transform -translate-x-2 md:-translate-x-2 z-10">
                    <motion.div
                      className="absolute inset-0 bg-primary rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.5,
                      }}
                    />
                  </div>

                  {/* Content Card */}
                  <div className={`w-full md:w-5/12 ml-16 md:ml-0 ${
                    index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                  }`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Card className="glass-card hover:shadow-lg transition-all duration-300 group">
                        <CardHeader className="pb-4">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                                  {exp.title}
                                </h3>
                                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                  <Building className="w-4 h-4" />
                                  <span className="font-medium">{exp.company}</span>
                                </div>
                              </div>
                              
                              {exp.current && (
                                <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                                  Current
                                </Badge>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
                              </div>
                              
                              {exp.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{exp.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                          {/* Achievements/Bullets */}
                          {exp.bullets && exp.bullets.length > 0 && (
                            <ul className="space-y-2 mb-4">
                              {exp.bullets.map((bullet, bulletIndex) => (
                                <li key={bulletIndex} className="flex items-start gap-3 text-sm">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                  <span className="leading-relaxed">{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* Keywords/Technologies */}
                          {exp.keywords && exp.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {exp.keywords.slice(0, 8).map((keyword, keywordIndex) => (
                                <Badge
                                  key={keywordIndex}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  {/* Spacer for desktop layout */}
                  <div className="hidden md:block w-5/12" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute top-40 right-10 w-20 h-20 rounded-full bg-primary/5 blur-xl -z-10"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </section>
  )
}
