"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { FileText, Home, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Resume", href: "/resume", icon: FileText },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        isScrolled
          ? "glass-card border-border/50 shadow-sm"
          : "bg-background/80 border-transparent"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm">R</span>
            </motion.div>
            <span className="hidden font-bold sm:inline-block">Resume</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary relative",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-6 left-0 right-0 h-0.5 bg-primary"
                      layoutId="activeTab"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden focus-ring"
            onClick={() => {
              // TODO: Implement mobile search
            }}
          >
            <Search className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Search</span>
          </Button>

          <ThemeToggle />

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" className="focus-ring">
              <div className="flex flex-col space-y-1">
                <div className="h-0.5 w-4 bg-current" />
                <div className="h-0.5 w-4 bg-current" />
                <div className="h-0.5 w-4 bg-current" />
              </div>
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Skip to content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium z-50"
      >
        Skip to content
      </a>
    </motion.header>
  )
}
