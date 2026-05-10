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
  Select,
  MenuItem,
  Collapse,
  ListItemIcon,
  ListItem,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import InsightsIcon from "@mui/icons-material/Insights";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const drawerWidth = 200;
const collapsedWidth = 60;

export default function MainLayout() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // 手机 drawer
  const [mobileOpen, setMobileOpen] = useState(false);

  // 桌面 collapse
  const [collapsed, setCollapsed] = useState(false);

  const currentWidth = collapsed ? collapsedWidth : drawerWidth;

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileOpen(false); // 手机点击自动关闭
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const menu = (
    <List>
      <ListItemButton onClick={() => handleNavigate("/")}>
        <DashboardIcon />
        <ListItemText
          primary={t("menu.dashboard")}
          sx={{ opacity: collapsed ? 0 : 1, ml: 1 }}
        />
      </ListItemButton>

      <Divider sx={{ my: 1 }} />

      <ListItemButton onClick={() => handleNavigate("/pipeline")}>
        <InsightsIcon />
        <ListItemText
          primary={t("menu.pipeline")}
          sx={{ opacity: collapsed ? 0 : 1, ml: 1 }}
        />
      </ListItemButton>

      <ListItemButton onClick={() => handleNavigate("/customers")}>
        <GroupIcon />
        <ListItemText
          primary={t("menu.customers")}
          sx={{ opacity: collapsed ? 0 : 1, ml: 1 }}
        />
      </ListItemButton>

      <ListItemButton onClick={() => handleNavigate("/follow-ups")}>
        <PendingActionsIcon />
        <ListItemText
          primary={t("menu.followups")}
          sx={{ opacity: collapsed ? 0 : 1, ml: 1 }}
        />
      </ListItemButton>

      <Divider sx={{ my: 1 }} />

      <ListItemButton onClick={() => handleNavigate("/orders")}>
        <ReceiptLongIcon />
        <ListItemText
          primary={t("menu.orders")}
          sx={{ opacity: collapsed ? 0 : 1, ml: 1 }}
        />
      </ListItemButton>

      <ListItemButton onClick={() => handleNavigate("/delivery-plans")}>
        <ReceiptLongIcon />
        <ListItemText
          primary={t("menu.delivery-plans")}
          sx={{ opacity: collapsed ? 0 : 1, ml: 1 }}
        />
      </ListItemButton>

      <ListItemButton onClick={() => handleNavigate("/delivery-tasks")}>
        <ReceiptLongIcon />
        <ListItemText
          primary={t("menu.delivery-tasks")}
          sx={{ opacity: collapsed ? 0 : 1, ml: 1 }}
        />
      </ListItemButton>

      <Divider sx={{ my: 1 }} />

      <ListItemButton onClick={() => handleNavigate("/products")}>
        <Inventory2Icon />
        <ListItemText
          primary={t("menu.products")}
          sx={{ opacity: collapsed ? 0 : 1, ml: 1 }}
        />
      </ListItemButton>

      <ListItemButton onClick={() => handleNavigate("/inventory")}>
        <Inventory2Icon />
        <ListItemText
          primary={t("menu.inventory")}
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

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t("app.title")}
          </Typography>

          {/* 语言切换 */}
          <Select
            value={i18n.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            sx={{
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "& .MuiSvgIcon-root": {
                color: "white",
              },
            }}
            size="small"
          >
            <MenuItem value="zh">{t("language.zh")}</MenuItem>
            <MenuItem value="en">{t("language.en")}</MenuItem>
          </Select>
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
