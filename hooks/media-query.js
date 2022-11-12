import { useState, useEffect } from "react";

const breakpoints = {
  xs: 575,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

/**
 *
 * @param {"xs" | "sm" | "md" | "lg" | "xl"} size Breakpoint size
 * @returns
 */
export const useMediaQuery = (size) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${breakpoints[size]}px)`);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, size]);

  return matches;
};
