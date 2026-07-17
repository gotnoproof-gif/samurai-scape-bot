import "dotenv/config";
import { REST, Routes } from "discord.js";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { commandData } from "./commands.js";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Put it in your .env file or remote host variables.`);
  }
  return value;
}

export async function registerCommands() {
  const token = requireEnv("DISCORD_TOKEN");
  const clientId = requireEnv("DISCORD_CLIENT_ID");
  const guildId = process.env.DISCORD_GUILD_ID;
  const rest = new REST({ version: "10" }).setToken(token);

  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commandData
    });
    console.log(`Registered ${commandData.length} guild commands.`);
    return;
  }

  await rest.put(Routes.applicationCommands(clientId), {
    body: commandData
  });
  console.log(`Registered ${commandData.length} global commands.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  registerCommands().catch(error => {
    console.error(error);
    process.exit(1);
  });
}
