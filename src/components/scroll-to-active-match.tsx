"use client"

import { useEffect } from "react"

type ScrollToActiveMatchProps = {
  matchId: number
}

export default function ScrollToActiveMatch({ matchId }: ScrollToActiveMatchProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const element = document.getElementById(`match-${matchId}`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })

        // Subtle highlight effect using CSS variables
        element.style.boxShadow = '0 0 0 1px var(--accent), 0 4px 20px rgba(224, 49, 49, 0.08)'

        const removeTimer = setTimeout(() => {
          element.style.boxShadow = ''
        }, 2500)

        return () => clearTimeout(removeTimer)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [matchId])

  return null
}
