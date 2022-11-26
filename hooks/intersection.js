import { useEffect, useState } from "react";

const observerOpts = {
  root: null,
  rootMargin: "-80% 0px -120px 0px",
  threshold: 0,
};

export function useIntersection(elementRef) {
  const [visible, setVisible] = useState(false);

  const intersectionHandler = (entries) => {
    const [entry] = entries;
    setVisible(entry.isIntersecting);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      intersectionHandler,
      observerOpts
    );
    const refCurrent = elementRef.current;
    if (refCurrent) observer.observe(refCurrent);
    return () => {
      if (refCurrent) observer.unobserve(refCurrent);
    };
  }, [elementRef]);

  return visible;
}
