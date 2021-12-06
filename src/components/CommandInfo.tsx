import * as React from "react";
import BaseCommand from "../server/client/utils/structures/BaseCommand";
import { Box } from "@mui/system";
import { Paper, ThemeProvider } from "@mui/material";
import theme from "../themes/TajawalFont";
import {
  DropdownCommandContainer,
  DropdownCommandHeader,
} from "../themes/StyledComponents";

export const CommandInfo = (props: { command: BaseCommand }) => {
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const { command } = props;
  return (
    <ThemeProvider theme={theme}>
      <Box p={5}>
        <DropdownCommandHeader onClick={() => setExpanded(!expanded)}>
          <p>{command.name}</p>
        </DropdownCommandHeader>
        <DropdownCommandContainer expanded={expanded}>
          <a style={{ display: "flex" }}>
            <p style={{ marginRight: "10px", color: "white" }}>Command:</p>
            <p style={{ color: "#7f8fa6" }}>{command.name}</p>
          </a>
          <a style={{ display: "flex" }}>
            <p style={{ marginRight: "10px", color: "white" }}>Description:</p>
            <p style={{ color: "#7f8fa6" }}>{command.description}</p>
          </a>
          <a style={{ display: "flex" }}>
            <p style={{ marginRight: "10px", color: "white" }}>Usage:</p>
            <p style={{ color: "#7f8fa6" }}>{command.usage}</p>
          </a>
          <a style={{ display: "flex" }}>
            <p style={{ marginRight: "10px", color: "white" }}>
              Required User Perms:
            </p>
            <p style={{ color: "#7f8fa6" }}>
              {command.userPermissions[0]
                ? command.userPermissions.join(" | ")
                : "No Permissions Are Required."}
            </p>
          </a>
          <a style={{ display: "flex" }}>
            <p style={{ marginRight: "10px", color: "white" }}>
              Required Bot Perms:
            </p>
            <p style={{ color: "#7f8fa6" }}>
              {command.botPermissions[0]
                ? command.botPermissions.join(" | ")
                : "No Permissions Are Required."}
            </p>
          </a>
        </DropdownCommandContainer>
      </Box>
    </ThemeProvider>
  );
};
