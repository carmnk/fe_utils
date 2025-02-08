import { useState, useCallback, useRef } from 'react'

export type UseElementHoverParams = {
  disabled?: boolean
}

export const useElementHover = (params?: UseElementHoverParams) => {
  const { disabled } = params ?? {}
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseOver = useCallback((e: MouseEvent) => {
    e.stopPropagation()
    setIsHovering(true)
  }, [])
  const handleMouseOut = useCallback((e: MouseEvent) => {
    e.stopPropagation()
    setIsHovering(false)
  }, [])

  const nodeRef = useRef<HTMLElement>(undefined)

  const callbackRef = useCallback(
    (node: HTMLElement) => {
      if (disabled) return
      if (nodeRef.current) {
        nodeRef.current.removeEventListener('mouseover', handleMouseOver)
        nodeRef.current.removeEventListener('mouseout', handleMouseOut)
      }

      nodeRef.current = node

      if (nodeRef.current) {
        nodeRef.current.addEventListener('mouseover', handleMouseOver)
        nodeRef.current.addEventListener('mouseout', handleMouseOut)
      }
    },
    [handleMouseOver, handleMouseOut, disabled]
  )

  return { callbackRef, isHovering, nodeRef }
}
