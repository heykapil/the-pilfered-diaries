import { createStyles } from "@mantine/core";

const useLargeCardStyles = createStyles((theme) => ({
  wrapper: {
    backgroundColor: theme.colors.gray[8],
    borderRadius: theme.radius.md,
  },
  guestMarker: {
    position: "absolute",
    top: -18,
    left: 0,
    fontWeight: 500,
    padding: `0px ${theme.spacing.xs}px`,
    color: theme.white,
    borderTopRightRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,
    backgroundColor: `${theme.colors.indigo[5]}EF`,
  },
  image: {
    borderTopRightRadius: theme.radius.md,
    borderTopLeftRadius: theme.radius.md,
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "column",
    userSelect: "none",
    position: "relative",
  },
}));

export default useLargeCardStyles;
