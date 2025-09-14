"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { CheckCircle, TrendingUp, Users, Zap } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface HighlightsSectionProps {
  highlights: string[]
  className?: string
}

const highlightIcons = [CheckCircle, TrendingUp, Users, Zap, CheckCircle, TrendingUp]

export function HighlightsSection({ highlights, className }: HighlightsSectionProps) {
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

  if (!highlights || highlights.length === 0) {
    return null
  }

  return (
    <section id="highlights" className={`py-20 ${className}`}>
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Key <span className="text-gradient">Highlights</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Notable achievements and value propositions that define my professional impact
            </p>
          </motion.div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.slice(0, 6).map((highlight, index) => {
              const Icon = highlightIcons[index] || CheckCircle
              
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="h-full glass-card hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed text-foreground group-hover:text-foreground/90 transition-colors">
                            {highlight}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/5 blur-xl -z-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <motion.div
            className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-secondary/5 blur-xl -z-10"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </motion.div>
      </div>
    </section>
  )
}
