import { createStyles } from "@mantine/core";

const useLargeCardStyles = createStyles((theme) => ({
  wrapper: {
    backgroundColor: theme.colors.gray[8],
    borderRadius: theme.radius.md,
  },
  image: {
    borderTopRightRadius: theme.radius.md,
    borderTopLeftRadius: theme.radius.md,
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "column",
    userSelect: "none",
  },
}));

export default useLargeCardStyles;
