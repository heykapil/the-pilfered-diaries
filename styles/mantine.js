const overrides = {
  emotionOptions: { key: "tpd" },
  theme: {
    colorScheme: "light",
    primaryColor: "indigo",
    transitionTimingFunction: "ease-in-out",
  },
  defaultProps: {
    Modal: {
      overlayBlur: 5,
      overlayColor: "#111",
      overlayOpacity: 0.5,
      overflow: "inside",
    },
    Drawer: {
      overlayBlur: 5,
      overlayColor: "#111",
      overlayOpacity: 0.5,
      overflow: "inside",
    },
    ScrollArea: {
      type: "scroll",
      scrollbarSize: 4,
      scrollHideDelay: 1500,
    },
    TextInput: {
      mb: "sm",
    },
    PasswordInput: {
      mb: "sm",
      toggleTabIndex: 0,
    },
    Stepper: {
      breakpoint: "md",
      iconSize: 36,
    },
  },
};

export default overrides;
