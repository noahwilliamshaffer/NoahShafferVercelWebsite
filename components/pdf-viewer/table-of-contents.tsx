"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Hash } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { usePDF } from '@/components/providers/pdf-provider'
import type { TOCItem } from '@/lib/pdf-utils'

interface TableOfContentsProps {
  onItemClick?: (pageNumber: number) => void
  className?: string
}

export function TableOfContents({ onItemClick, className }: TableOfContentsProps) {
  const { tocItems, currentPage } = usePDF()

  if (tocItems.length === 0) {
    return (
      <div className={cn("p-4 text-center", className)}>
        <Hash className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No table of contents available
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          TOC will be generated from document structure
        </p>
      </div>
    )
  }

  const handleItemClick = (item: TOCItem) => {
    onItemClick?.(item.pageNumber)
  }

  const getLevelIndent = (level: number) => {
    return Math.min(level - 1, 4) * 16 // Max 4 levels of indentation
  }

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'text-foreground'
      case 2: return 'text-muted-foreground'
      case 3: return 'text-muted-foreground/80'
      default: return 'text-muted-foreground/60'
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <div className={cn("h-full", className)}>
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
          Table of Contents
        </h3>
      </div>

      <ScrollArea className="flex-1">
        <motion.div 
          className="p-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {tocItems.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="mb-1"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleItemClick(item)}
                className={cn(
                  "w-full justify-start text-left h-auto py-2 px-3 rounded-md transition-all duration-200",
                  "hover:bg-accent/50 focus:bg-accent/50",
                  currentPage === item.pageNumber && "bg-accent text-accent-foreground",
                  getLevelColor(item.level)
                )}
                style={{
                  paddingLeft: `${12 + getLevelIndent(item.level)}px`
                }}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {item.level > 1 && (
                    <ChevronRight className="w-3 h-3 flex-shrink-0 opacity-40" />
                  )}
                  
                  <span className="text-xs font-medium flex-shrink-0 opacity-60 min-w-[2ch]">
                    {item.pageNumber}
                  </span>
                  
                  <span 
                    className={cn(
                      "flex-1 min-w-0 text-left leading-snug",
                      item.level === 1 && "font-medium",
                      item.level === 2 && "font-normal",
                      item.level >= 3 && "text-sm"
                    )}
                    title={item.title}
                  >
                    {item.title}
                  </span>
                </div>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </ScrollArea>
    </div>
  )
}



