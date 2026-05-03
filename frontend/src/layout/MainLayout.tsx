import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

const drawerWidth = 200;
const collapsedWidth = 60;

export default function MainLayout() {
  const navigate = useNavigate();

  // 手机 drawer
  const [mobileOpen, setMobileOpen] = useState(false);

  // 桌面 collapse
  const [collapsed, setCollapsed] = useState(false);

  const currentWidth = collapsed ? collapsedWidth : drawerWidth;

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileOpen(false); // 手机点击自动关闭
  };

  const menu = (
    <List>
      <ListItemButton onClick={() => handleNavigate("/")}>
        <DashboardIcon />
        <ListItemText
          primary="Dashboard"
          sx={{ opacity: collapsed ? 0 : 1, ml: 1 }}
        />
      </ListItemButton>

      <ListItemButton onClick={() => handleNavigate("/pipeline")}>
        <PeopleIcon />
        <ListItemText
          primary="Pipeline"
          sx={{ opacity: collapsed ? 0 : 1, ml: 1 }}
        />
      </ListItemButton>

      <ListItemButton onClick={() => handleNavigate("/customers")}>
        <PeopleIcon />
        <ListItemText
          primary="Customers"
          sx={{ opacity: collapsed ? 0 : 1, ml: 1 }}
        />
      </ListItemButton>

      <ListItemButton onClick={() => handleNavigate("/follow-ups")}>
        <EventIcon />
        <ListItemText
          primary="Follow-ups"
          sx={{ opacity: collapsed ? 0 : 1, ml: 1 }}
        />
      </ListItemButton>
    </List>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* 顶部栏 */}
      <AppBar
        position="fixed"
        sx={{
          width: {
            sm: `calc(100% - ${currentWidth}px)`,
          },
          ml: {
            sm: `${currentWidth}px`,
          },
          transition: "all 0.3s",
        }}
      >
        <Toolbar>
          {/* 手机菜单按钮 */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* 桌面折叠按钮 */}
          <IconButton
            color="inherit"
            onClick={() => setCollapsed(!collapsed)}
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6">CRM</Typography>
        </Toolbar>
      </AppBar>

      {/* 手机 Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        {menu}
      </Drawer>

      {/* 桌面 Drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: currentWidth,
            transition: "width 0.3s",
            overflowX: "hidden",
          },
        }}
      >
        {menu}
      </Drawer>

      {/* 主内容 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: {
            sm: `${currentWidth}px`,
          },
          transition: "all 0.3s",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}