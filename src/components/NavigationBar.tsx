import { ClientUser } from "discord.js";
import UserResponse from "../types/UserResponse";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import navLinks from "../utils/navLinks";
import Link from "next/link";
import UserHeader from "./UserObject";
const NavigationBar = (props: {
  botData: ClientUser;
  userData: UserResponse;
}) => {
  const { botData, userData } = props;

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="sticky" color="transparent">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            color='white'
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            {botData.username}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {navLinks.map((page, index) => (
                <MenuItem key={index} onClick={handleCloseNavMenu}>
                  <Link href={page.path.replace("{botId}", botData.id)}>
                    {page.name.replace("{BotName}", botData.username)}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            color="white"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            {botData.username}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {navLinks.map((page, index) => (
              <Link key={index} href={page.path.replace("{botId}", botData.id)}>
                <Button
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.name.replace("{BotName}", botData.username)}
                </Button>
              </Link>
            ))}
          </Box>

          <UserHeader botUser={botData} user={userData} />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavigationBar;
