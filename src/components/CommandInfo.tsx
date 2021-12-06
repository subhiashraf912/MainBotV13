import * as React from 'react'
import BaseCommand from '../server/client/utils/structures/BaseCommand';
import { Box } from '@mui/system';
import { Paper, ThemeProvider } from '@mui/material';
import theme from '../themes/TajawalFont';

export const CommandInfo = (props: {command: BaseCommand}) => {
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const { command } = props;
  return (
    <ThemeProvider theme = {theme}>

    <Box p={5}>
      <Paper>
        <Box p={5}>
          <div>
            Command: { command.name }
          </div>
        </Box>
        <Box p={5}>
          <div>
            Aliases: { command.aliases[0]? command.aliases.join(' | ') : "No Aliases" }
          </div>
        </Box>
        <Box p={5}>
          <div>
            Description: { command.description }
          </div>
        </Box>
        <Box p={5}>
          <div>
            Usage: { command.usage }
          </div>
        </Box>
        <Box p={5}>
          <div>
            Needed user Permissoons: { command.userPermissions[0]? command.userPermissions.join(' | ') : "No Permissions are required" }
          </div>
        </Box>
        <Box p={5}>
          <div>
            Needed bot Permissoons: { command.botPermissions[0]? command.botPermissions.join(' | ') : "No Permissions are required" }
          </div>
        </Box>
      </Paper>
      </Box>
    </ThemeProvider>
      
    // <div>
    //   <DropdownCommandHeader onClick={() => setExpanded(!expanded)}>
    //     <p>{command.name}</p>
    //   </DropdownCommandHeader>
    //   <DropdownCommandContainer expanded={expanded}>
    //     <a style={{ display: "flex" }}>
    //       <p style={{ marginRight: "10px", color:"white" }}>Command:</p>
    //       <p style={{ color: "#7f8fa6" }}>{command.name}</p>
    //     </a>
    //     <a style={{ display: "flex" }}>
    //       <p style={{ marginRight: "10px", color:"white"  }}>Description:</p>
    //       <p style={{ color: "#7f8fa6" }}>{command.description}</p>
    //     </a>
    //     <a style={{ display: "flex" }}>
    //       <p style={{ marginRight: "10px", color:"white"  }}>Usage:</p>
    //       <p style={{ color: "#7f8fa6" }}>{command.usage}</p>
    //     </a>
    //     <a style={{ display: "flex" }}>
    //       <p style={{ marginRight: "10px", color:"white"  }}>Needed Permissions:</p>
    //       <p style={{ color: "#7f8fa6" }}>{command.userPermissions[0]? command.userPermissions.join(" | ") :"No Permissions Are Required." }</p>
    //     </a>
    //   </DropdownCommandContainer>

    // </div>
  );
};