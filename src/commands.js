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
    .setName("boss")
    .setDescription("Create, join, list, and ping boss tags.")
    .addSubcommand(subcommand =>
      subcommand
        .setName("create")
        .setDescription("Create a boss tag.")
        .addStringOption(option =>
          option
            .setName("name")
            .setDescription("Boss tag name, like Nex, ToA, CoX, or Bandos")
            .setRequired(true)
            .setMaxLength(60)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("delete")
        .setDescription("Delete a boss tag.")
        .addStringOption(option =>
          option
            .setName("name")
            .setDescription("Boss tag name")
            .setRequired(true)
            .setMaxLength(60)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("join")
        .setDescription("Join a boss tag so you can be pinged.")
        .addStringOption(option =>
          option
            .setName("name")
            .setDescription("Boss tag name")
            .setRequired(true)
            .setMaxLength(60)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("leave")
        .setDescription("Leave a boss tag.")
        .addStringOption(option =>
          option
            .setName("name")
            .setDescription("Boss tag name")
            .setRequired(true)
            .setMaxLength(60)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("list")
        .setDescription("List boss tags or show members in one tag.")
        .addStringOption(option =>
          option
            .setName("name")
            .setDescription("Optional boss tag name")
            .setRequired(false)
            .setMaxLength(60)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("ping")
        .setDescription("Ping everyone signed up for a boss tag.")
        .addStringOption(option =>
          option
            .setName("name")
            .setDescription("Boss tag name")
            .setRequired(true)
            .setMaxLength(60)
        )
        .addStringOption(option =>
          option
            .setName("message")
            .setDescription("Optional note, like world, gear, or time")
            .setRequired(false)
            .setMaxLength(300)
        )
    ),

  new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Roll a RuneScape-style die.")
    .addIntegerOption(option =>
      option
        .setName("sides")
        .setDescription("How many sides? Default is 100.")
        .setMinValue(2)
        .setMaxValue(100000)
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("coin")
    .setDescription("Flip a coin."),

  new SlashCommandBuilder()
    .setName("drop")
    .setDescription("Roll a silly RuneScape drop.")
    .addStringOption(option =>
      option
        .setName("boss")
        .setDescription("Boss or monster name")
        .setRequired(false)
        .setMaxLength(80)
    ),

  new SlashCommandBuilder()
    .setName("oracle")
    .setDescription("Ask the ronin oracle a yes/no question.")
    .addStringOption(option =>
      option
        .setName("question")
        .setDescription("Your question")
        .setRequired(true)
        .setMaxLength(200)
    ),

  new SlashCommandBuilder()
    .setName("duel")
    .setDescription("Stage a silly RuneScape duel.")
    .addStringOption(option =>
      option
        .setName("opponent")
        .setDescription("Who or what are you dueling?")
        .setRequired(false)
        .setMaxLength(80)
    ),

  new SlashCommandBuilder()
    .setName("roninhelp")
    .setDescription("Show the bot commands.")
].map(command => command.toJSON());
