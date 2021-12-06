import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import * as React from "react";
import BaseCommand from "../server/client/utils/structures/BaseCommand";
import config from "../config.json";
import { ClientUser, PermissionString } from "discord.js";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { CommandInfo } from "../components/CommandInfo";
import { Grid } from "@mui/material";
import Layout from "../components/Layout";
import UserResponse from "../types/UserResponse";
import { NextSeo } from "next-seo";

type Anchor = "left";

type commandType = {
  name: string;
  description: string;
  usage: string;
  botPermissions: PermissionString[];
  userPermissions: PermissionString[];
  aliases: string[];
};

const formatString = (str: string) =>
  `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

const CommandsPage = ({
  commands: clientCommands,
  user,
  clientUser,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const commands: BaseCommand[] = clientCommands;
  const directories = [...new Set(commands.map((cmd) => cmd.category))];
  const categories = directories.map((dir) => {
    const getCommands: commandType[] | undefined = commands
      .filter((cmd) => cmd.category === dir)
      .map((cmd) => {
        return {
          name: cmd.name,
          description: cmd.description,
          usage: cmd.usage,
          botPermissions: cmd.botPermissions,
          userPermissions: cmd.userPermissions,
          aliases: cmd.aliases,
        };
      });
    return {
      directory: formatString(dir),
      commands: getCommands,
    };
  });

  const getcommandsByCategory = (category: string) =>
    commands.filter(
      (cate) => cate.category.toLowerCase() === category.toLowerCase()
    )!;

  const [state, setState] = React.useState({
    left: false,
  });

  const [selected, setSelected] = React.useState<string>("");
  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {directories.map((text, index) => (
          <ListItem color="black" button key={index}>
            <ListItemText onClick={() => setSelected(text)} primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Layout botData={clientUser} userData={user}>
      <NextSeo
        title={`${clientUser.username} Commands`}
        description={`A list of all of the commands in ${clientUser.username} bot!`}
      />
      <div>
        <React.Fragment>
          <Button onClick={toggleDrawer("left", true)}>Open Categories</Button>

          <SwipeableDrawer
            anchor={"left"}
            open={state["left"]}
            onClose={toggleDrawer("left", false)}
            onOpen={toggleDrawer("left", true)}
          >
            {list("left")}
          </SwipeableDrawer>
          <Grid container columnSpacing={{ xs: 0.5, sm: 1, md: 1.5 }}>
            {getcommandsByCategory(selected)?.map((command, index) => {
              return (
                <Grid
                  key={index}
                  item
                  xs={9}
                  sm={7}
                  md={6}
                  lg={4}
                  xl={3}
                  marginTop={"30px"}
                >
                  <CommandInfo command={command} />
                </Grid>
              );
            })}
          </Grid>
        </React.Fragment>
      </div>
    </Layout>
  );
};

export default CommandsPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, res } = ctx;
  const { cookies } = req;
  const commandsResponse = await fetch(
    `${config.dashboard}/api/client/commands`
  );
  const clientUserResponse = await fetch(`${config.dashboard}/api/client/user`);
  const clientUser: ClientUser = await clientUserResponse.json();
  const commands: BaseCommand[] = await commandsResponse.json();

  try {
    const DiscordCookie = cookies.DISCORD_OAUTH2_SESSION_ID;
    const profileResponse = await fetch(
      `${config.dashboard}/api/user/profile`,
      {
        headers: {
          Cookie: `DISCORD_OAUTH2_SESSION_ID=${DiscordCookie}`,
        },
      }
    );

    const user: UserResponse = await profileResponse.json();
    return {
      props: {
        clientUser,
        commands,
        user,
      },
    };
  } catch (err) {
    return {
      props: {
        user: null,
        commands,
        clientUser,
      },
    };
  }
};
