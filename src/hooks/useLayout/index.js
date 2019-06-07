import { useLayoutEffect } from 'react'
import ltr from './ltr'
import rtl from './rtl'

export default function useLayout (layout) {
  useLayoutEffect(
    () => {
      const l = layout === 'ltr' ? ltr : rtl
      // Iterate through each value in theme object
      for (const key in l) {
        // Update css variables in document's root element
        document.documentElement.style.setProperty(`--${key}`, l[key])
      }
    },
    [layout] // Only call again if theme object reference changes
  )
}
