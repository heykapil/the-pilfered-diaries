export function scrollToContent() {
  const { offsetTop } = document.getElementById("contentBlock");
  document.scrollingElement.scrollTo({
    top: offsetTop - 50,
    behavior: "smooth",
  });
}
