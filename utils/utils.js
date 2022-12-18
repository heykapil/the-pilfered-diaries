import { APP_TITLE, SHARE, SITE_URL } from "@constants/app";

export function scrollToRef(elementRef, offset = 60) {
  const { offsetTop } = elementRef.current;
  document.scrollingElement.scrollTo({
    top: offsetTop - offset,
    behavior: "smooth",
  });
  document.activeElement.blur();
}

export const handleFragmentNavigation = (e) => {
  e.preventDefault();
  e.stopPropagation();
  const targetElement = document.getElementById(
    e.target.getAttribute("href").slice(1)
  );
  const { offsetTop } = targetElement;
  const prContent = document.getElementById("prContent");
  if (prContent)
    prContent.scrollTo({
      top: offsetTop - 60,
      behavior: "smooth",
    });
  else
    document.scrollingElement.scrollTo({
      top: offsetTop - 60,
      behavior: "smooth",
    });
};

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

export const setMailCookie = (email) => {
  const date = new Date();
  date.setTime(date.getTime() + 180 * 24 * 60 * 60 * 1000);
  const cookie = `_sub=${email}; Expires=${date.toUTCString()}; Path=/; SameSite=true; Secure=true`;
  document.cookie = cookie;
};

export const getMailCookie = () => {
  const cookies = document.cookie;
  return (
    cookies
      .split("; ")
      .find((cookie) => cookie.startsWith("_sub"))
      ?.split("=")[1] ?? false
  );
};
