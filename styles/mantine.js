/** @type {import('@mantine/core').MantineTheme} */
const overrides = {
  colorScheme: "light",
  primaryColor: "indigo",
  white: "#ffffff",
  transitionTimingFunction: "ease-in-out",
  components: {
    Drawer: {
      defaultProps: {
        overlayBlur: 10,
        overlayColor: "#ffffff77",
      },
    },
    Modal: {
      defaultProps: {
        overlayBlur: 10,
        overlayColor: "#ffffff77",
      },
    },
    ScrollAres: {
      defaultProps: {
        scrollbarSize: 6,
      },
    },
    TextInput: {
      defaultProps: {
        mb: "sm",
        inputWrapperOrder: ["label", "input", "error", "description"],
      },
    },
    Textarea: {
      defaultProps: {
        mb: "sm",
        inputWrapperOrder: ["label", "input", "error", "description"],
      },
    },
  },
};

export default overrides;
