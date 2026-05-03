"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface JarvisMessage {
  id: number
  text: string
  type: "info" | "alert" | "success" | "warning"
}

interface JarvisInterfaceProps {
  networkIQ: number
  agentsOnline: number
  asyncPower: string
  newBlockArrived: boolean
  hasAgentTx: boolean
}

export function JarvisInterface({
  networkIQ,
  agentsOnline,
  asyncPower,
  newBlockArrived,
  hasAgentTx,
}: JarvisInterfaceProps) {
  const [messages, setMessages] = useState<JarvisMessage[]>([])
  const [messageId, setMessageId] = useState(0)

  const addMessage = (text: string, type: JarvisMessage["type"] = "info") => {
    const id = messageId
    setMessageId(prev => prev + 1)
    setMessages(prev => [...prev.slice(-2), { id, text, type }])
    
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== id))
    }, 4000)
  }

  useEffect(() => {
    if (newBlockArrived) {
      if (hasAgentTx) {
        addMessage("Agent activity detected in latest block", "alert")
      } else {
        addMessage("New block synchronized", "success")
      }
    }
  }, [newBlockArrived, hasAgentTx])

  useEffect(() => {
    if (networkIQ >= 180) {
      addMessage("Network operating at peak intelligence", "success")
    } else if (networkIQ < 90) {
      addMessage("Network activity below optimal threshold", "warning")
    }
  }, [networkIQ])

  useEffect(() => {
    if (asyncPower === "overload") {
      addMessage("Async execution systems at maximum capacity", "alert")
    }
  }, [asyncPower])

  const getStatusColor = () => {
    if (networkIQ >= 150) return "text-primary"
    if (networkIQ >= 100) return "text-chart-3"
    return "text-muted-foreground"
  }

  return (
    <>
      {/* Jarvis Status Bar */}
      <motion.div
        className="fixed top-6 left-1/2 -translate-x-1/2 z-40 font-mono"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded px-6 py-2 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs text-muted-foreground">System online</span>
          </div>

          <div className="h-4 w-px bg-border" />

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Neural IQ</span>
            <span className={`text-sm font-bold ${getStatusColor()}`}>{networkIQ}</span>
          </div>

          <div className="h-4 w-px bg-border" />

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Agents</span>
            <span className="text-sm font-bold text-accent">{agentsOnline}</span>
          </div>

          <div className="h-4 w-px bg-border" />

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Async</span>
            <span className={`text-sm font-bold ${
              asyncPower === "overload" ? "text-accent" :
              asyncPower === "ready" ? "text-primary" :
              asyncPower === "charging" ? "text-chart-3" :
              "text-muted-foreground"
            }`}>
              {asyncPower}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Jarvis Messages */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", damping: 25 }}
              className={`mb-2 bg-card/90 backdrop-blur-sm border rounded px-4 py-2 font-mono text-sm ${
                message.type === "alert" ? "border-accent text-accent" :
                message.type === "success" ? "border-primary text-primary" :
                message.type === "warning" ? "border-chart-3 text-chart-3" :
                "border-border text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className={`w-1.5 h-1.5 rounded-full ${
                    message.type === "alert" ? "bg-accent" :
                    message.type === "success" ? "bg-primary" :
                    message.type === "warning" ? "bg-chart-3" :
                    "bg-foreground"
                  }`}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span>{message.text}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Corner HUD Elements */}
      <motion.div
        className="fixed top-6 left-6 z-30 font-mono text-xs text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="space-y-1">
          <div>RITUAL_PULSE_v2.0</div>
          <div className="text-primary">NEURAL_INTERFACE_ACTIVE</div>
        </div>
      </motion.div>

      <motion.div
        className="fixed top-6 right-6 z-30 font-mono text-xs text-muted-foreground text-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="space-y-1">
          <div>{new Date().toLocaleTimeString()}</div>
          <div className="text-primary">MONITORING_ACTIVE</div>
        </div>
      </motion.div>
    </>
  )
}
