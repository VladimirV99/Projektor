import { useMemo } from 'react'
import useBreakpoint, { Config } from 'use-breakpoint'
import theme from '../theme'

const useExactBreakpoint = () => {
    const breakpoints = useMemo(() => theme.breakpoints, [])

    const { breakpoint } = useBreakpoint(breakpoints)

    return {
        breakpoint,
        isSmall: breakpoint === breakpoints.small,
        isMedium: breakpoint === breakpoints.medium,
        isLarge: breakpoint === breakpoints.large,
        isXLarge: breakpoint === breakpoints.xlarge,
    }
}

export default useExactBreakpoint
