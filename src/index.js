import "dotenv/config";
import {
  ActivityType,
  Client,
  Events,
  GatewayIntentBits
} from "discord.js";
import { handleBossCommand } from "./bossTags.js";
import { handleFunCommand } from "./funCommands.js";
import { askRonin } from "./openaiClient.js";
import { registerCommands } from "./register-commands.js";
import { startHealthServer } from "./server.js";
import { createTagStore } from "./storage.js";
import { randomItem, trimForDiscord } from "./utils.js";

const quests = [
  "Quest scroll: travel to Varrock at dusk, recover the jade katana beneath the bank, and return with honor and a teleport tab.",
  "Quest scroll: gather monkfish, sharpen your blade, and escort a lost adventurer from Lumbridge to Falador.",
  "Quest scroll: defeat the shadow under Edgeville, then offer the loot to your clan chest.",
  "Quest scroll: mine three ores, smith one helm, and teach a fresh adventurer the way of patience."
];

const clanQuotes = [
  "A dull blade blames the anvil. Train again.",
  "Bank your fear, withdraw discipline.",
  "The Grand Exchange moves coins. Honor moves warriors.",
  "Eat before the fight. Teleport before shame becomes a gravestone.",
  "A true ronin checks prayer points before destiny."
];

function getMentionPrompt(message, botUser) {
  const mentionPattern = new RegExp(`<@!?${botUser.id}>`, "g");
  return message.content.replace(mentionPattern, "").trim();
}

function requireStartupEnv() {
  for (const name of ["DISCORD_TOKEN", "DISCORD_CLIENT_ID", "OPENAI_API_KEY"]) {
    if (!process.env[name]) {
      throw new Error(`Missing ${name}. Add it to .env or your remote host variables.`);
    }
  }
}

async function main() {
  requireStartupEnv();
  const tagStore = await createTagStore();
  console.log(`Boss tag storage ready: ${tagStore.label}.`);

  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
  });

  client.once(Events.ClientReady, async readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}.`);

    readyClient.user.setActivity(process.env.BOT_STATUS || "/ask the ronin", {
      type: ActivityType.Playing
    });

    if (process.env.REGISTER_COMMANDS_ON_START === "true") {
      await registerCommands();
    }
  });

  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    try {
      await interaction.deferReply();

      if (interaction.commandName === "boss") {
        await handleBossCommand(interaction, tagStore);
        return;
      }

      if (await handleFunCommand(interaction)) {
        return;
      }

      if (interaction.commandName === "quest") {
        await interaction.editReply(randomItem(quests));
        return;
      }

      if (interaction.commandName === "clanquote") {
        await interaction.editReply(randomItem(clanQuotes));
        return;
      }

      if (interaction.commandName === "roninhelp") {
        await interaction.editReply([
          "**Ronin of Gielinor commands**",
          "`/ask` - ask the AI samurai anything",
          "`/boss create/join/leave/list/ping` - manage boss tags",
          "`/quest` - get a quest hook",
          "`/skill` - get skilling advice",
          "`/gear` - get simple gear advice",
          "`/clanquote` - get a short clan quote",
          "`/roll`, `/coin`, `/drop`, `/oracle`, `/duel` - fun clan commands"
        ].join("\n"));
        return;
      }

      if (interaction.commandName === "skill") {
        const skill = interaction.options.getString("name", true);
        const level = interaction.options.getInteger("level");
        const prompt = level
          ? `Give simple, legit RuneScape training advice for ${skill} at level ${level}.`
          : `Give simple, legit RuneScape training advice for ${skill}.`;
        const answer = await askRonin(prompt);
        await interaction.editReply(trimForDiscord(answer));
        return;
      }

      if (interaction.commandName === "gear") {
        const activity = interaction.options.getString("activity", true);
        const answer = await askRonin(
          `Give simple beginner-friendly gear advice for this RuneScape activity: ${activity}. Mention food, prayer, and risk if relevant.`
        );
        await interaction.editReply(trimForDiscord(answer));
        return;
      }

      if (interaction.commandName === "ask") {
        const prompt = interaction.options.getString("prompt", true);
        const answer = await askRonin(prompt);
        await interaction.editReply(trimForDiscord(answer));
      }
    } catch (error) {
      console.error(error);
      const message = "The ronin dropped his blade. Something went wrong. Check the bot logs.";

      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(message);
      } else {
        await interaction.reply({ content: message, ephemeral: true });
      }
    }
  });

  client.on(Events.MessageCreate, async message => {
    if (message.author.bot || !client.user || !message.mentions.has(client.user)) return;

    const prompt = getMentionPrompt(message, client.user);

    try {
      await message.channel.sendTyping();

      if (!prompt) {
        await message.reply("Speak after my name, warrior. Try `@katana ronin bot what should I train today?`");
        return;
      }

      const answer = await askRonin(
        `A Discord user mentioned you in chat. Reply directly and conversationally. User said: ${prompt}`
      );
      await message.reply(trimForDiscord(answer));
    } catch (error) {
      console.error(error);
      await message.reply("The ronin heard you, but the blade slipped. Try again in a moment.");
    }
  });

  startHealthServer(client);
  await client.login(process.env.DISCORD_TOKEN);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
