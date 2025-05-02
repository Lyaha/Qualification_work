import * as React from "react"
import { chakra, ImageProps } from "@chakra-ui/react"
import { forwardRef } from "react"
import { keyframes } from "@emotion/react"
import logo from "./logo.svg"

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

// Хук для определения prefers-reduced-motion
function usePrefersReducedMotionFallback() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return prefersReducedMotion
}

export const Logo = forwardRef<HTMLImageElement, ImageProps>(
  (props, ref) => {
    const prefersReducedMotion = usePrefersReducedMotionFallback()

    const animation = prefersReducedMotion
      ? undefined
      : `${spin} infinite 20s linear`

    return <chakra.img animation={animation} src={logo} ref={ref} {...props} />
  }
)