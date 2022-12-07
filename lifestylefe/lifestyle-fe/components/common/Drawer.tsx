import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { Icon } from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";

import { SidebarContent } from "../../common/utils/constants";

const drawerWidth = 240;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  open: boolean;
  handleVisibility: () => void;
  window?: () => Window;
}

export default function DrawerComponent({
  open,
  window,
  handleVisibility,
}: Props) {
  const router = useRouter();

  const handleDrawerToggle = () => {
    handleVisibility();
  };

  const handleRouteChange = (route: string) => {
    router.push(route);
  };

  const drawer = (
    <div>
      <Toolbar style={{ backgroundColor: '#000', justifyContent: 'center' }}>
        <Image width={150} height={60} src={require('../../public/logo.jpeg')} alt="system logo" />
      </Toolbar>
      <Divider />
      <List>
        {SidebarContent.map(({ text, icon, route }, index) => (
          <ListItem
            key={text}
            disablePadding
            onClick={() => handleRouteChange(route)}
          >
            <ListItemButton>
              <ListItemIcon>
                <Icon component={icon} />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}
