import { createStyles } from "@mantine/core";

const useHeaderPageStyles = createStyles((theme, params) => ({
  header: {
    height: "100vh",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    flexDirection: "column",
    padding: 0,
  },
  headerContent: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${theme.colors.dark[9]}BB`,
    backdropFilter: "blur(3px)",
    padding: theme.spacing.lg,
  },
  title: {
    fontFamily: "'Lato', sans-serif",
    fontStyle: "italic",
    lineHeight: 1.25,
    fontSize: params.isMobile ? "2rem" : "4rem",
    textAlign: "center",
    color: theme.white,
    fontWeight: "bold",
    maxWidth: "600px",
  },
}));

export default useHeaderPageStyles;
