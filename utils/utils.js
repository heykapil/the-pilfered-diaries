import { APP_TITLE, SHARE, SITE_URL } from "@constants/app";

export function scrollToRef(elementRef, offset = 60) {
  const { offsetTop } = elementRef.current;
  document.scrollingElement.scrollTo({
    top: offsetTop - offset,
    behavior: "smooth",
  });
  document.activeElement.blur();
}

function generateParams(params) {
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    urlParams.set(key, value);
  });
  return urlParams.toString();
}

export function generateShareLink(text, url, type) {
  switch (type) {
    case "whatsapp":
      return `${SHARE[type].path}?${generateParams({
        text: `Read “${text}” on ${APP_TITLE}: ${SITE_URL}${url}`,
      })}`;
    case "facebook":
      return `${SHARE[type].path}?${generateParams({
        t: `Read “${text}” on ${APP_TITLE}`,
        u: SITE_URL + url,
      })}`;
    case "twitter":
    case "linkedIn":
      return `${SHARE[type].path}?${generateParams({
        text: `Read “${text}” on ${APP_TITLE}`,
        url: SITE_URL + url,
      })}`;

    default:
      break;
  }
}
