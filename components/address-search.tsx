"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X } from "lucide-react"

interface AddressSearchProps {
  onSearch: (address: string) => void
  isSearching: boolean
}

export function AddressSearch({ onSearch, isSearching }: AddressSearchProps) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  const handleClear = () => {
    setQuery("")
  }

  if (!mounted) return null

  return (
    <motion.div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`relative bg-card border rounded transition-all ${
            isFocused ? "border-primary shadow-lg shadow-primary/20" : "border-border"
          }`}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search address, transaction hash, or block number..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none font-mono text-sm"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  type="button"
                  onClick={handleClear}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {isSearching && (
            <div className="absolute inset-0 bg-card/80 backdrop-blur-sm rounded flex items-center justify-center">
              <div className="flex items-center gap-2 text-primary font-mono text-sm">
                <motion.div
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                Analyzing...
              </div>
            </div>
          )}
        </div>

        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full mt-2 left-0 right-0 bg-card border border-border rounded p-3 text-xs text-muted-foreground font-mono"
          >
            <div className="space-y-1">
              <div>• Address: 0x1234...abcd</div>
              <div>• Transaction: 0xabcd...1234</div>
              <div>• Block: 14367000</div>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  )
}
