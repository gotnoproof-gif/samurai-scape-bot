# Railway Setup For Beginners

This is the simple version.

## 1. Application ID

This is Discord's ID for your bot app.

1. Go to https://discord.com/developers/applications
2. Click your bot application.
3. Click `General Information`.
4. Copy `Application ID`.

Use it as:

```env
DISCORD_CLIENT_ID=paste_application_id_here
```

## 2. Server ID

This is Discord's ID for your server.

1. Open Discord.
2. Click the gear near your username.
3. Go to `Advanced`.
4. Turn on `Developer Mode`.
5. Go back to your server list.
6. Right-click your server icon.
7. Click `Copy Server ID`.

Use it as:

```env
DISCORD_GUILD_ID=paste_server_id_here
```

## 3. Confirm The Bot Is Invited

The bot is invited if you can see it in your server's member list.

It may show as offline until Railway is running it. That is normal.

If it is not in your server:

1. Go to Discord Developer Portal.
2. Open your bot application.
3. Go to `OAuth2`.
4. Go to `URL Generator`.
5. Check `bot`.
6. Check `applications.commands`.
7. Under bot permissions, check:
   - `View Channels`
   - `Send Messages`
   - `Read Message History`
8. Copy the generated URL.
9. Open it in your browser.
10. Pick your Discord server.
11. Click authorize.

## 4. Discord Bot Token

This is a secret. Do not post it in chat.

1. Go to Discord Developer Portal.
2. Open your bot application.
3. Click `Bot`.
4. Click `Reset Token` or `Copy Token`.
5. Put it into Railway Variables as `DISCORD_TOKEN`.

## 5. OpenAI API Key

This is also a secret. Do not post it in chat.

1. Go to https://platform.openai.com/api-keys
2. Create an API key.
3. Copy it right away.
4. Put it into Railway Variables as `OPENAI_API_KEY`.

## 6. Railway Variables

In Railway:

1. Open your Railway project.
2. Click the bot service.
3. Click `Variables`.
4. Add these one by one:

```env
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_application_id
DISCORD_GUILD_ID=your_discord_server_id
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5.6-luna
REGISTER_COMMANDS_ON_START=true
BOT_STATUS=/ask the ronin
PORT=3000
```

After adding variables, deploy or redeploy the service.

## 7. Test It

When Railway says the bot is running:

1. Open Discord.
2. Go to your server.
3. Type `/roninhelp`.
4. If commands appear, the bot is alive.

