# Samurai Scape Discord Bot

This is a RuneScape-inspired samurai Discord bot with AI-powered slash commands.

It is fan-made and not official RuneScape or Jagex.

## What the bot can do

- `/ask` asks the AI samurai a question.
- `/quest` gives a RuneScape-style samurai quest hook.
- `/skill` gives simple training advice.
- `/gear` gives simple gear advice.
- `/clanquote` gives a short clan quote.
- `/roninhelp` lists the commands.

## Files you need to care about

- `.env.example` shows the secret settings you need.
- `src/index.js` starts the bot.
- `src/persona.js` controls the samurai personality.
- `src/commands.js` controls the slash commands.

## Local setup

Install Node.js 20 or newer first.

Then run:

```bash
npm install
```

Copy `.env.example` to a new file named `.env`.

Fill in:

```env
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_application_id
DISCORD_GUILD_ID=your_server_id
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5.6-luna
REGISTER_COMMANDS_ON_START=true
BOT_STATUS=/ask the ronin
PORT=3000
```

Start the bot:

```bash
npm start
```

## Discord setup

In the Discord Developer Portal:

1. Create an application.
2. Add a bot.
3. Copy the bot token into `DISCORD_TOKEN`.
4. Copy the application ID into `DISCORD_CLIENT_ID`.
5. Invite the bot with these OAuth2 scopes:
   - `bot`
   - `applications.commands`
6. Give it these permissions:
   - View Channels
   - Send Messages
   - Read Message History

## Remote hosting setup

Railway is the easiest option for this bot.

1. Upload this folder to GitHub.
2. Create a Railway project from the GitHub repo.
3. Add the same variables from `.env.example` inside Railway Variables.
4. Deploy it.

The bot has a small health page at `/health` so hosts can see that it is awake.

## What I need from you to finish it fully remote

Do not paste secrets in public places. If you want someone else to deploy it for you, share these only through the host's secret-variable screen or another private method.

Required:

- Discord bot token.
- Discord application ID, also called client ID.
- Discord server ID, also called guild ID.
- OpenAI API key.
- A remote host choice, such as Railway, Render, Fly.io, or a VPS.
- Permission to invite the bot to your Discord server.

Helpful:

- Bot name.
- Bot profile picture.
- Server name.
- Whether it should answer only slash commands or also reply when mentioned.
- Whether you want it to remember user preferences later.
