const navLinks = [
  { name: "Home", path: "/" },
  {
    name: "Invite bot",
    path: "https://discord.com/api/oauth2/authorize?client_id={botId}&permissions=8&scope=bot%20applications.commands",
  },
  {
    name: "Vote for {BotName}",
    path: "https://top.gg/bot/{botId}/vote",
  },
  {
    name: "Commands",
    path: "/commands",
  },
  {
    name: "Support Server",
    path: "https://discord.gg/nQ55ZUSavA",
  },
];
export default navLinks;
