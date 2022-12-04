import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandWhatsapp,
} from "@tabler/icons";

export const APP_TITLE = "The Pilfered Diaries";
export const INSTA_HANDLE = "/the.pilfered.diaries";
export const INSTA_LINK = `https://instagram.com${INSTA_HANDLE}`;
export const LINKEDIN_LINK = "https://linkedin.com/in/amittras-pal";
export const REPO_LINK = "https://github.com/amittras-pal/the-pilfered-diaries";
export const SITE_URL = "https://thepilfereddiaries.in";
export const COMMENT_HEADER = "Comments on";
export const ISR_INTERVAL = 3600; // seconds
export const AVG_READING_SPEED = 250; // words per minute.
export const GUEST_POST_MARKER_TEXT = "By A Guest";
export const FONT_SIZE_RANGE = [15, 22];
export const COMMENT_NOTICE =
  "NOTE: Your comment will be sent for review & moderation. Please refrain from using profanity or slangs. Also make sure to enter a short title, and use the body for longer thoughts. Everything else is just fine.";

export const DATE_FORMATS = {
  date: "MMM DD, YYYY",
  dateTime: "MMM DD, YYYY, HH:MM A",
};

export const TAGLINE = (
  <>
    When a thinker finds lost words,
    <br />
    Stories Happen.
  </>
);

export const FOOTER_LINK_PROPS = {
  "data-bs-toggle": "tooltip",
  "data-bs-offset": "0,5",
  "data-bs-placement": "top",
  target: "_blank",
};

export const SHARE = {
  whatsapp: {
    path: "https://api.whatsapp.com/send",
    icon: <IconBrandWhatsapp size={16} />,
    label: "Whatsapp",
  },
  facebook: {
    path: "https://www.facebook.com/sharer.php",
    icon: <IconBrandFacebook size={16} />,
    label: "Facebook",
  },
  twitter: {
    path: "https://twitter.com/intent/tweet",
    icon: <IconBrandTwitter size={16} />,
    label: "Twitter",
  },
  linkedIn: {
    path: "https://www.linkedin.com/shareArticle",
    icon: <IconBrandLinkedin size={16} />,
    label: "LinkedIn",
  },
};
