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
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useRouter } from "next/router";
import LogoutIcon from "@mui/icons-material/Logout";
import Cookie from "js-cookie";
import Head from "next/head";
import { getPath } from "../common/utils/validations";

const drawerWidth = 240;

export default function App({ Component, pageProps, router: nextRouter }: AppProps) {
  const router = useRouter();
  const [drawerVisibility, setDrawerVisibility] = useState(false);
  const handleDrawerVisibility = () => {
    setDrawerVisibility(!drawerVisibility);
  };
  
  const theme = createTheme({
    palette: {
      primary: {
        main: "#153462",
      },
    },
    typography: {
      fontFamily: ["-apple-system", '"Helvetica Neue"'].join(","),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Lifestyle Fitness Studio</title>
      </Head> 
      {router.pathname === "/login" ? 
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            p: 3,
          }}
        >
          <Component {...pageProps} />
        </Box>
       : (
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Box sx={{ display: "flex" }}>
            <AppBar
              position="fixed"
              sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
              }}
            >
              <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerVisibility}
                  sx={{ mr: 2, display: { sm: "none" } }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography fontSize="22px" fontWeight="600">{getPath(nextRouter.pathname)}</Typography>
                <IconButton
                  onClick={() => {
                    Cookie.remove("token"), router.push("/login");
                  }}
                  sx={{ color: '#fff' }}
                >
                  <LogoutIcon />
                  <Typography fontSize={14} fontWeight={600} ml={1}>Logout</Typography>
                </IconButton>
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
        </LocalizationProvider>
      )}
    </ThemeProvider>
  );
}
