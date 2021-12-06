import * as React from "react";
import { Avatar, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import { ClientUser } from "discord.js";
import Link from "next/link";
import UserResponse from "../types/UserResponse";

type props = {
  botUser: ClientUser;
  user?: UserResponse;
};

const UserHeader = (props: props) => {
  const { user, botUser } = props;
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  if (user) {
    const settings = [
      {
        text: "Profile",
        path: "/api/user/profile",
      },
      {
        text: "Account",
        path: "/api/user/account",
      },
      {
        text: "Logout",
        path: "api/auth/token/revoke",
      },
    ];

    return (
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar
              alt={user.username}
              src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=4096`}
            />
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {settings.map((setting, index) => (
            <MenuItem key={index} onClick={handleCloseNavMenu}>
              <Link href={setting.path}>{setting.text}</Link>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  } else {
    const settings = [
      {
        text: "Login",
        path: "/api/auth/login",
      },
    ];

    return (
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar
              alt={botUser.username}
              src={`https://cdn.discordapp.com/avatars/${botUser.id}/${botUser.avatar}.png?size=4096`}
            />
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {settings.map((setting, index) => (
            <MenuItem key={index}>
              <Link href={setting.path}>{setting.text}</Link>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }
};

export default UserHeader;
