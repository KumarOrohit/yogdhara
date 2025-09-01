// theme.ts
import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    background: {
      default: "#f3f0f9", // very light lavender background
    },
    primary: {
      main: "#3b3c92", // purplish indigo (calm, spiritual feel)
    },
    secondary: {
      main: "#7c4dff", // bright purple accent
    },
    text: {
      primary: "#1a1a1a", // almost black for good contrast
      secondary: "#4a4a6a", // soft bluish gray for calm secondary text
    },
  },
});
