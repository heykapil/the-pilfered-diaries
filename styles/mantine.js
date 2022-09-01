/** @type {import('@mantine/core').MantineTheme} */
const overrides = {
  colorScheme: "dark",
  primaryColor: "indigo",
  white: "#ffffff",
  black: "#22221e",
  transitionTimingFunction: "ease-in-out",
  components: {
    Drawer: {
      defaultProps: {
        overlayBlur: 10,
        overlayColor: "#22221e77",
      },
    },
    Modal: {
      defaultProps: {
        overlayBlur: 10,
        overlayColor: "#22221e77",
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
