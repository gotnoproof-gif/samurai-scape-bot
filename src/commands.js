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
    .setName("quote")
    .setDescription("Get a famous, samurai, clan, or RuneScape-style quote.")
    .addStringOption(option =>
      option
        .setName("category")
        .setDescription("Quote category")
        .setRequired(false)
        .addChoices(
          { name: "Random", value: "random" },
          { name: "Samurai", value: "samurai" },
          { name: "Famous", value: "famous" },
          { name: "RuneScape", value: "runescape" },
          { name: "Clan", value: "clan" }
        )
    ),

  new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Post a funny RuneScape-style meme image.")
    .addStringOption(option =>
      option
        .setName("topic")
        .setDescription("Optional meme topic")
        .setRequired(false)
        .setMaxLength(80)
    )
    .addStringOption(option =>
      option
        .setName("style")
        .setDescription("Meme style")
        .setRequired(false)
        .addChoices(
          { name: "Random", value: "random" },
          { name: "Drop", value: "drop" },
          { name: "Grind", value: "grind" },
          { name: "Boss", value: "boss" },
          { name: "Bank", value: "bank" },
          { name: "Clan", value: "clan" }
        )
    ),

  new SlashCommandBuilder()
    .setName("xp")
    .setDescription("Track fun XP drops, level-ups, and leaderboards.")
    .addSubcommand(subcommand =>
      subcommand
        .setName("gain")
        .setDescription("Log an XP drop.")
        .addStringOption(option =>
          option
            .setName("skill")
            .setDescription("Skill name")
            .setRequired(true)
            .setMaxLength(40)
        )
        .addIntegerOption(option =>
          option
            .setName("amount")
            .setDescription("XP gained")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(200000000)
        )
        .addStringOption(option =>
          option
            .setName("note")
            .setDescription("Optional flex note")
            .setRequired(false)
            .setMaxLength(160)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("level")
        .setDescription("Announce a level-up.")
        .addStringOption(option =>
          option
            .setName("skill")
            .setDescription("Skill name")
            .setRequired(true)
            .setMaxLength(40)
        )
        .addIntegerOption(option =>
          option
            .setName("level")
            .setDescription("Level reached")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(99)
        )
        .addStringOption(option =>
          option
            .setName("note")
            .setDescription("Optional flex note")
            .setRequired(false)
            .setMaxLength(160)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("board")
        .setDescription("Show the XP leaderboard.")
        .addStringOption(option =>
          option
            .setName("skill")
            .setDescription("Optional skill name")
            .setRequired(false)
            .setMaxLength(40)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("reset")
        .setDescription("Reset your tracked XP.")
        .addStringOption(option =>
          option
            .setName("skill")
            .setDescription("Optional skill name")
            .setRequired(false)
            .setMaxLength(40)
        )
    ),

  new SlashCommandBuilder()
    .setName("samurai")
    .setDescription("Track the storyline path from adventurer to samurai.")
    .addSubcommand(subcommand =>
      subcommand
        .setName("path")
        .setDescription("Show samurai path progress.")
        .addUserOption(option =>
          option
            .setName("user")
            .setDescription("Optional server member")
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("train")
        .setDescription("Train on the samurai path and gain story XP.")
        .addStringOption(option =>
          option
            .setName("action")
            .setDescription("What did you train or do?")
            .setRequired(false)
            .setMaxLength(160)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("board")
        .setDescription("Show the samurai path leaderboard.")
    ),

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
    .setName("profile")
    .setDescription("Generate a fun ronin profile card.")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Optional server member")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("loot")
    .setDescription("Announce a loot flex.")
    .addStringOption(option =>
      option
        .setName("item")
        .setDescription("Loot item")
        .setRequired(true)
        .setMaxLength(100)
    )
    .addStringOption(option =>
      option
        .setName("source")
        .setDescription("Where it came from")
        .setRequired(false)
        .setMaxLength(80)
    )
    .addIntegerOption(option =>
      option
        .setName("value")
        .setDescription("Estimated value in gp")
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(2000000000)
    ),

  new SlashCommandBuilder()
    .setName("choose")
    .setDescription("Let the ronin choose between options.")
    .addStringOption(option =>
      option
        .setName("options")
        .setDescription("Choices separated by commas, lines, or |")
        .setRequired(true)
        .setMaxLength(500)
    ),

  new SlashCommandBuilder()
    .setName("timer")
    .setDescription("Set a simple Discord reminder timer.")
    .addIntegerOption(option =>
      option
        .setName("minutes")
        .setDescription("Minutes until reminder")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(720)
    )
    .addStringOption(option =>
      option
        .setName("label")
        .setDescription("Reminder text")
        .setRequired(true)
        .setMaxLength(160)
    ),

  new SlashCommandBuilder()
    .setName("roast")
    .setDescription("Give a friendly clan roast.")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Optional server member")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("compliment")
    .setDescription("Give a clan member a boost.")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Optional server member")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("trivia")
    .setDescription("Post a quick RuneScape trivia question."),

  new SlashCommandBuilder()
    .setName("roninhelp")
    .setDescription("Show the bot commands.")
].map(command => command.toJSON());
