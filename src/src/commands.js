import { SlashCommandBuilder } from "discord.js";

export const commandData = [
  new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask the AI samurai a question.")
    .addStringOption(option =>
      option
        .setName("prompt")
        .setDescription("What do you want to ask?")
        .setRequired(true)
        .setMaxLength(1500)
    ),

  new SlashCommandBuilder()
    .setName("quest")
    .setDescription("Receive a RuneScape-style samurai quest hook."),

  new SlashCommandBuilder()
    .setName("skill")
    .setDescription("Get training advice for a RuneScape skill.")
    .addStringOption(option =>
      option
        .setName("name")
        .setDescription("Example: woodcutting, magic, slayer")
        .setRequired(true)
        .setMaxLength(40)
    )
    .addIntegerOption(option =>
      option
        .setName("level")
        .setDescription("Your current level")
        .setMinValue(1)
        .setMaxValue(99)
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("gear")
    .setDescription("Get simple gear advice for a boss or activity.")
    .addStringOption(option =>
      option
        .setName("activity")
        .setDescription("Example: Jad, Barrows, Slayer, dragons")
        .setRequired(true)
        .setMaxLength(80)
    ),

  new SlashCommandBuilder()
    .setName("clanquote")
    .setDescription("Get a short samurai clan quote."),

  new SlashCommandBuilder()
    .setName("roninhelp")
    .setDescription("Show the bot commands.")
].map(command => command.toJSON());
