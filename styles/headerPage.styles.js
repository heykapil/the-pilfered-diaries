import { createStyles } from "@mantine/core";

const useHeaderPageStyles = createStyles((theme, params) => ({
  header: {
    height: "100vh",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    flexDirection: "column",
    padding: 0,
  },
  headerContent: {
    backgroundColor: `${theme.black}AA`,
    borderRadius: theme.radius.md,
    backdropFilter: "blur(8px)",
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: params.isMobile ? "2rem" : "4rem",
    textAlign: "center",
    color: theme.white,
    fontWeight: "bold",
  },
}));

export default useHeaderPageStyles;
