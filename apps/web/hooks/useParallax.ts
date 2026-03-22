'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Returns a progress value (0→1) representing how far the section
 * has scrolled through the snap container viewport.
 * 0 = section just entered from bottom, 0.5 = centered, 1 = exited to top.
 */
export function useParallax() {
  const ref = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const main = document.querySelector('main')
    const el = ref.current
    if (!main || !el) return

    let raf: number

    const update = () => {
      const mainRect = main.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      const viewH = mainRect.height

      // How far the element's top is from the container's top, normalized
      const offset = elRect.top - mainRect.top
      // -viewH (fully scrolled past) to +viewH (not yet visible)
      const p = 1 - (offset + viewH) / (2 * viewH)
      setProgress(Math.max(0, Math.min(1, p)))
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    main.addEventListener('scroll', onScroll, { passive: true })
    update() // initial

    return () => {
      main.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return { ref, progress }
}
