import { useState } from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Drawer from "../components/common/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  createTheme,
  ThemeProvider,
} from "@mui/material";

const drawerWidth = 240;

export default function App({ Component, pageProps }: AppProps) {
  const [drawerVisibility, setDrawerVisibility] = useState(false);

  const handleDrawerVisibility = () => {
    setDrawerVisibility(!drawerVisibility);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#153462",
      },
      secondary: {
        main: "#3E6D9C",
      },
    },
    typography: {
      fontFamily: ["-apple-system", '"Helvetica Neue"'].join(","),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerVisibility}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            open={drawerVisibility}
            handleVisibility={handleDrawerVisibility}
          />
        </Box>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <Toolbar />
          <Component {...pageProps} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
