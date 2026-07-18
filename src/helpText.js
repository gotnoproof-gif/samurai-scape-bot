export function getCommandHelpText() {
  return [
    "**Ronin of Gielinor commands**",
    "`/ask prompt:...` - ask the AI samurai anything",
    "`/boss create name:Nex` - create a boss tag",
    "`/boss join name:Nex` - join a boss tag",
    "`/boss leave name:Nex` - leave a boss tag",
    "`/boss list` - show boss tags",
    "`/boss ping name:Nex message:World 330` - ping everyone in a tag",
    "`/quest` - get a quest hook",
    "`/skill name:slayer level:70` - get skilling advice",
    "`/gear activity:Jad` - get simple gear advice",
    "`/clanquote` - get a short clan quote",
    "`/roll`, `/coin`, `/drop`, `/oracle`, `/duel` - fun clan commands"
  ].join("\n");
}

export function isCommandHelpRequest(text) {
  const normalized = text.toLowerCase();

  return [
    "command",
    "commands",
    "help",
    "what can you do",
    "how do i use you",
    "what do you do",
    "slash commands"
  ].some(phrase => normalized.includes(phrase));
}

export function isAmbientCommandHelpRequest(text) {
  const normalized = text.toLowerCase();

  if (!isCommandHelpRequest(normalized)) {
    return false;
  }

  return [
    "ronin",
    "katana",
    "samurai",
    "bot commands",
    "slash commands",
    "what can the bot do",
    "what commands does the bot"
  ].some(phrase => normalized.includes(phrase));
}
