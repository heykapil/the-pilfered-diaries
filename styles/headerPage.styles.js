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
    backgroundColor: `${theme.black}AA`,
    borderRadius: theme.radius.md,
    backdropFilter: "blur(8px)",
    padding: theme.spacing.lg,
    maxWidth: "95%",
  },
  title: {
    fontFamily: "'Lato', sans-serif",
    fontStyle: "italic",
    lineHeight: 1.25,
    fontSize: params.isMobile ? "2rem" : "4rem",
    textAlign: "center",
    color: theme.white,
    fontWeight: "bold",
  },
}));

export default useHeaderPageStyles;
