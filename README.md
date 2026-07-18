# Samurai Scape Discord Bot

This is a RuneScape-inspired samurai Discord bot with AI-powered slash commands.

It is fan-made and not official RuneScape or Jagex.

## What the bot can do

- `/ask` asks the AI samurai a question.
- `/quest` gives a RuneScape-style samurai quest hook.
- `/skill` gives simple training advice.
- `/gear` gives simple gear advice.
- `/clanquote` gives a short clan quote.
- `/boss create/join/leave/list/ping` manages boss tags.
- `/xp gain/level/board/reset` tracks fun XP drops and server leaderboards.
- `/meme` posts RuneScape-style meme images.
- `/quote` posts famous, samurai, clan, or RuneScape-style quotes.
- `/profile`, `/loot`, `/choose`, and `/timer` add game-night tools.
- `/roll`, `/coin`, `/drop`, `/oracle`, and `/duel` are fun clan commands.
- `/roast`, `/compliment`, and `/trivia` add more chat fun.
- Random chat memes can be enabled so the bot sometimes replies to normal messages with RuneScape-style meme lines or meme images.
- `/roninhelp` lists the commands.
- Mentioning the bot and asking for `commands` or `help` also shows the command list.

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
DISCORD_GUILD_ID=
COMMAND_SCOPE=global
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5.6-luna
REGISTER_COMMANDS_ON_START=true
BOT_STATUS=/ask the ronin
PORT=3000
DATABASE_URL=
MEME_RESPONDER_ENABLED=true
MESSAGE_CONTENT_INTENT_ENABLED=false
MEME_IMAGE_RESPONDER_ENABLED=true
MEME_REPLY_CHANCE=0.06
MEME_KEYWORD_REPLY_CHANCE=0.22
MEME_IMAGE_REPLY_CHANCE=0.35
MEME_COOLDOWN_MS=180000
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

Boss tags do not require Discord roles. The bot stores signups and pings the saved users directly.

Slash commands are global by default, so they work in every server where the bot is invited. Discord can take a few minutes to show new global commands in a newly invited server. For one-server testing, set `COMMAND_SCOPE=guild` and fill in `DISCORD_GUILD_ID`.

For random chat memes, turn on the bot's Message Content Intent in the Discord Developer Portal, then set `MESSAGE_CONTENT_INTENT_ENABLED=true`. Without that Discord switch, the bot can still run slash commands and boss tags, but it cannot read normal chat text.

## Remote hosting setup

Railway is the easiest option for this bot.

1. Upload this folder to GitHub.
2. Create a Railway project from the GitHub repo.
3. Add the same variables from `.env.example` inside Railway Variables.
4. For saved boss tags that survive redeploys, add a Railway Postgres service.
5. Add `DATABASE_URL=${{Postgres.DATABASE_URL}}` to the bot service variables.
6. To enable random chat memes, set:
   - `MEME_RESPONDER_ENABLED=true`
   - `MESSAGE_CONTENT_INTENT_ENABLED=true`
   - `MEME_IMAGE_RESPONDER_ENABLED=true`
   - `MEME_REPLY_CHANCE=0.06`
   - `MEME_KEYWORD_REPLY_CHANCE=0.22`
   - `MEME_IMAGE_REPLY_CHANCE=0.35`
   - `MEME_COOLDOWN_MS=180000`
7. Deploy it.

Without `DATABASE_URL`, the bot falls back to a local JSON file for development. That is fine for testing, but Postgres is the fully remote setup.

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
