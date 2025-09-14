"use client"

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowDown, ArrowUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { debounce } from '@/lib/utils'
import { usePDF } from '@/components/providers/pdf-provider'
import type { SearchResult } from '@/components/providers/pdf-provider'

interface SearchPanelProps {
  onResultClick?: (pageNumber: number) => void
  className?: string
}

export function SearchPanel({ onResultClick, className }: SearchPanelProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  const { search, isIndexing, indexingProgress } = usePDF()

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        setSelectedIndex(-1)
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      
      try {
        const searchResults = search(searchQuery)
        setResults(searchResults)
        setSelectedIndex(searchResults.length > 0 ? 0 : -1)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
        setSelectedIndex(-1)
      } finally {
        setIsSearching(false)
      }
    }, 300),
    [search]
  )

  useEffect(() => {
    debouncedSearch(query)
  }, [query, debouncedSearch])

  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result.pageNumber)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < results.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : results.length - 1
      )
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleResultClick(results[selectedIndex])
    }
  }

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="search-highlight">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setSelectedIndex(-1)
  }

  if (isIndexing) {
    return (
      <div className={cn("p-4 text-center", className)}>
        <Search className="w-8 h-8 mx-auto mb-3 text-muted-foreground animate-pulse" />
        <p className="text-sm text-muted-foreground mb-2">
          Indexing document for search...
        </p>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary rounded-full h-2 transition-all duration-300"
            style={{ width: `${indexingProgress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {Math.round(indexingProgress)}% complete
        </p>
      </div>
    )
  }

  return (
    <div className={cn("h-full flex flex-col", className)}>
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
          Search Document
        </h3>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search in document..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

        {results.length > 0 && (
          <div className="flex items-center justify-between mt-3">
            <Badge variant="secondary" className="text-xs">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </Badge>
            
            {selectedIndex >= 0 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIndex(prev => 
                    prev > 0 ? prev - 1 : results.length - 1
                  )}
                  className="h-7 w-7 p-0"
                >
                  <ArrowUp className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIndex(prev => 
                    prev < results.length - 1 ? prev + 1 : 0
                  )}
                  className="h-7 w-7 p-0"
                >
                  <ArrowDown className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div
              key="searching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 text-center"
            >
              <Search className="w-6 h-6 mx-auto mb-2 text-muted-foreground animate-pulse" />
              <p className="text-sm text-muted-foreground">Searching...</p>
            </motion.div>
          ) : query && results.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 text-center"
            >
              <Search className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No results found for "{query}"
              </p>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-2"
            >
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleResultClick(result)}
                    className={cn(
                      "w-full justify-start text-left h-auto py-3 px-3 rounded-md mb-1",
                      "hover:bg-accent/50 focus:bg-accent/50",
                      selectedIndex === index && "bg-accent text-accent-foreground"
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          Page {result.pageNumber}
                        </Badge>
                      </div>
                      
                      <p className="text-sm leading-relaxed line-clamp-3">
                        {highlightText(result.context, query)}
                      </p>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </ScrollArea>
    </div>
  )
}

