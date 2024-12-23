You need to create .env file first:

```sh
KODIK_API_URI=      # Kodik API base URI
KODIK_AUTH_TOKEN=   # Kodik token for API access

SHIKIMORI_API_URI=                    # Shikimori API base URI
SHIKIMORI_CLIENT_ID=                  # Shikimori OAuth client ID
SHIKIMORI_CLIENT_SECRET=              # Shikimori Oauth client secret
SHIKIMORI_EPISODE_NOTIFICATION_TOKEN= # Shikimori token for creating new anime episode topics
# see more here: https://shikimori.one/api/doc/2.0/episode_notifications/create

SMARTHARD_API_URI=        # SmarthardNET API base URI
SMARTHARD_CLIENT_ID=      # SmarthardNET OAuth client ID
SMARTHARD_CLIENT_SECRET=  # SmarthardNET OAuth client secret
```

It would be used to generate common Angular environment.ts files with command: `npm run set-env`
