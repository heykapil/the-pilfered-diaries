export function scrollToContent(elementId) {
  const { offsetTop } = document.getElementById(elementId);
  document.scrollingElement.scrollTo({
    top: offsetTop - 60,
    behavior: "smooth",
  });
  document.activeElement.blur();
}
