export function scrollToContent(elementId) {
  const { offsetTop } = document.getElementById(elementId);
  document.scrollingElement.scrollTo({
    top: offsetTop - 50,
    behavior: "smooth",
  });
}
