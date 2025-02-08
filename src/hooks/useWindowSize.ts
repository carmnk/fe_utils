'use client';
import { useEffect, useState } from 'react'

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<{
    width: number
    height: number
  }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const onResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', onResize)
    return () => {
      if (typeof window === 'undefined') {
        return
      }
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return windowSize
}
