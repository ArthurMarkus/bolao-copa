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

        // Efeito visual suave de destaque temporário
        element.classList.add(
          "ring-2",
          "ring-amber-500/50",
          "shadow-xl",
          "shadow-amber-500/10"
        )

        const removeTimer = setTimeout(() => {
          element.classList.remove(
            "ring-2",
            "ring-amber-500/50",
            "shadow-xl",
            "shadow-amber-500/10"
          )
        }, 2500)

        return () => clearTimeout(removeTimer)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [matchId])

  return null
}
