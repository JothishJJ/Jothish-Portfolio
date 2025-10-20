"use client"

import { useEffect, useState } from "react"

export default function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMove)

    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return <div className="fixed top-0 left-0 w-6 h-6 rounded-full bg-white bg-white/50 border border-white pointer-events-none mix-blend-difference transition-transform duration-75 ease-out z-[999]"
    style={{ transform: `translate(${position.x - 12}px, ${position.y - 12}px)` }}
  ></div>
}

