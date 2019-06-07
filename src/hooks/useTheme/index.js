import { useLayoutEffect } from 'react'
import theme1 from './theme1'
import theme2 from './theme2'

export default function useTheme (theme) {
  useLayoutEffect(
    () => {
      const t = theme === 'theme1' ? theme1 : theme2
      // Iterate through each value in theme object
      for (const key in t) {
        // Update css variables in document's root element
        document.documentElement.style.setProperty(`--${key}`, t[key])
      }
    },
    [theme] // Only call again if theme object reference changes
  )
}
