"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { GraduationCap, Calendar, MapPin, Award, Star } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ParsedEducation, ParsedCertification } from "@/lib/resume-parser"

interface EducationSectionProps {
  education: ParsedEducation[]
  certifications: ParsedCertification[]
  className?: string
}

export function EducationSection({ education, certifications, className }: EducationSectionProps) {
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

  const hasEducation = education && education.length > 0
  const hasCertifications = certifications && certifications.length > 0

  if (!hasEducation && !hasCertifications) {
    return null
  }

  return (
    <section id="education" className={`py-20 ${className}`}>
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
              Education & <span className="text-gradient">Certifications</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Academic background and professional certifications that support my expertise
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Education */}
            {hasEducation && (
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold">Education</h3>
                </div>

                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Card className="glass-card hover:shadow-lg transition-all duration-300 group">
                        <CardHeader className="pb-4">
                          <div className="space-y-2">
                            <h4 className="text-lg font-semibold group-hover:text-primary transition-colors">
                              {edu.degree}
                            </h4>
                            <p className="text-muted-foreground font-medium">
                              {edu.institution}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              {edu.graduationDate && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{edu.graduationDate}</span>
                                </div>
                              )}
                              
                              {edu.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{edu.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <div className="flex flex-wrap gap-2">
                            {edu.gpa && (
                              <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-300">
                                GPA: {edu.gpa}
                              </Badge>
                            )}
                            
                            {edu.honors && edu.honors.map((honor, honorIndex) => (
                              <Badge
                                key={honorIndex}
                                variant="secondary"
                                className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-300"
                              >
                                <Star className="w-3 h-3 mr-1" />
                                {honor}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Certifications */}
            {hasCertifications && (
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Award className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold">Certifications</h3>
                </div>

                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Card className="glass-card hover:shadow-lg transition-all duration-300 group">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2 flex-1">
                              <h4 className="font-semibold group-hover:text-primary transition-colors">
                                {cert.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {cert.issuer}
                              </p>
                              
                              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{cert.date}</span>
                                </div>
                                
                                {cert.expiryDate && (
                                  <div className="flex items-center gap-1">
                                    <span>Expires: {cert.expiryDate}</span>
                                  </div>
                                )}
                                
                                {cert.credentialId && (
                                  <div className="flex items-center gap-1">
                                    <span>ID: {cert.credentialId}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {cert.url && (
                              <a
                                href={cert.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 transition-colors opacity-0 group-hover:opacity-100"
                                aria-label="View certification"
                              >
                                <Award className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Background Decorations */}
          <div className="absolute -z-10">
            <motion.div
              className="absolute top-20 left-1/4 w-20 h-20 rounded-full bg-primary/5 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <motion.div
              className="absolute bottom-20 right-1/4 w-24 h-24 rounded-full bg-secondary/5 blur-xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 7,
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
