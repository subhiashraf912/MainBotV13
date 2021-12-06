import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import * as React from "react";
import BaseCommand from "../server/client/utils/structures/BaseCommand";
import config from "../config.json";
import { ClientUser } from "discord.js";
import { CommandInfo } from "../components/CommandInfo";
import { Grid } from "@mui/material";
import Layout from "../components/Layout";
import UserResponse from "../types/UserResponse";
import { NextSeo } from "next-seo";
import {
  DropdownMenuItemContainer,
  SelectItem,
  SelectMenuDropDownHeader,
} from "../themes/StyledComponents";
import { Box } from "@mui/system";

const formatString = (str: string) =>
  `${str[0].toUpperCase()}${str
    .slice(1)
    .toLowerCase()
    .replaceAll("_", " ")
    .replaceAll("-", " ")}`;

const CommandsPage = ({
  commands: clientCommands,
  user,
  clientUser,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const commands: BaseCommand[] = clientCommands;
  const directories = [...new Set(commands.map((cmd) => cmd.category))];

  const getcommandsByCategory = (category: string) =>
    commands.filter(
      (cate) => cate.category.toLowerCase() === category.toLowerCase()
    )!;

  const [selected, setSelected] = React.useState<string>("");
  const [expanded, setExpanded] = React.useState<boolean>(true);

  return (
    <Layout botData={clientUser} userData={user}>
      <NextSeo
        title={`${clientUser.username} Commands`}
        description={`A list of all of the commands in ${clientUser.username} bot!`}
      />
      <div>
        <React.Fragment>
          <Box p={5}>
            <SelectMenuDropDownHeader onClick={() => setExpanded(!expanded)}>
              Select A Category
            </SelectMenuDropDownHeader>
            <DropdownMenuItemContainer expanded={expanded}>
              {directories.map((item, index) => {
                return (
                  <SelectItem
                    key={index}
                    onClick={() => {
                      setSelected(item);
                      setExpanded(false);
                    }}
                  >
                    {formatString(item)}
                  </SelectItem>
                );
              })}
            </DropdownMenuItemContainer>
          </Box>
          A
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
