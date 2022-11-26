export function scrollToRef(elementRef, offset = 60) {
  const { offsetTop } = elementRef.current;
  document.scrollingElement.scrollTo({
    top: offsetTop - offset,
    behavior: "smooth",
  });
  document.activeElement.blur();
}
