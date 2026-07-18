# Railway Variables To Paste

Paste these into Railway's `Variables` tab.

The two blank values are secrets. Put them directly into Railway, not in Discord chat, GitHub, or Codex chat.

```env
DISCORD_TOKEN=
DISCORD_CLIENT_ID=1527802694759350323
DISCORD_GUILD_ID=1527803141926686720
COMMAND_SCOPE=global
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.6-luna
REGISTER_COMMANDS_ON_START=true
BOT_STATUS=/ask the ronin
PORT=3000
DATABASE_URL=${{Postgres.DATABASE_URL}}
MEME_RESPONDER_ENABLED=true
MESSAGE_CONTENT_INTENT_ENABLED=true
MEME_IMAGE_RESPONDER_ENABLED=true
MEME_REPLY_CHANCE=0.06
MEME_KEYWORD_REPLY_CHANCE=0.22
MEME_IMAGE_REPLY_CHANCE=0.35
MEME_COOLDOWN_MS=180000
```

After saving the variables, redeploy the Railway service.
