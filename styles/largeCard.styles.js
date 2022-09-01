import { createStyles } from "@mantine/core";

const useLargeCardStyles = createStyles((theme) => ({
  wrapper: {
    backgroundColor: theme.colors.gray[8],
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "column",
    userSelect: "none",
  },
}));

export default useLargeCardStyles;
