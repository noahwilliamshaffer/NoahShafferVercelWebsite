"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Code, Award, MessageSquare, Globe } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { ParsedSkill } from "@/lib/resume-parser"

interface SkillsSectionProps {
  skills: ParsedSkill[]
  className?: string
}

const categoryConfig = {
  technical: {
    label: "Technical Skills",
    icon: Code,
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },
  certification: {
    label: "Certifications",
    icon: Award,
    color: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
  },
  soft: {
    label: "Soft Skills",
    icon: MessageSquare,
    color: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  },
  language: {
    label: "Languages",
    icon: Globe,
    color: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  },
} as const

export function SkillsSection({ skills, className }: SkillsSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
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

  if (!skills || skills.length === 0) {
    return null
  }

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, ParsedSkill[]>)

  return (
    <section id="skills" className={`py-20 ${className}`}>
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
              Skills & <span className="text-gradient">Expertise</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive overview of technical skills, certifications, and professional competencies
            </p>
          </motion.div>

          {/* Skills by Category */}
          <div className="space-y-12">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => {
              const config = categoryConfig[category as keyof typeof categoryConfig]
              if (!config) return null

              const Icon = config.icon

              return (
                <motion.div
                  key={category}
                  variants={headerVariants}
                  className="space-y-6"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{config.label}</h3>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-sm text-muted-foreground">
                      {categorySkills.length} skill{categorySkills.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Skills Grid */}
                  <motion.div
                    className="flex flex-wrap gap-3"
                    variants={containerVariants}
                  >
                    {categorySkills.map((skill, index) => (
                      <motion.div
                        key={`${skill.name}-${index}`}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge
                          variant="outline"
                          className={`${config.color} hover:shadow-sm transition-all duration-200 cursor-default text-sm py-1.5 px-3`}
                        >
                          {skill.name}
                          {skill.level && (
                            <span className="ml-2 opacity-70 text-xs">
                              {skill.level}
                            </span>
                          )}
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )
            })}
          </div>

          {/* Floating Background Elements */}
          <div className="relative -z-10">
            <motion.div
              className="absolute top-20 left-1/4 w-24 h-24 rounded-full bg-primary/5 blur-xl"
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <motion.div
              className="absolute bottom-20 right-1/4 w-32 h-32 rounded-full bg-secondary/5 blur-xl"
              animate={{
                y: [20, -20, 20],
                x: [10, -10, 10],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3,
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
