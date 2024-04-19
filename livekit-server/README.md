# Livekit Access Token Server

## How to Start Access Token Server

### Start Access Token Server for Livekit

Access Token Server generates access token for Livekit Server.  
To start Access Token Server, execute the following command.

```text
npm run start
```

## Optional Configuration

### (Optional) Create Environment Variable Files with Template

- Create environment variable files as needed(e.g., `.env.local`, `.env.development`)
- You need to define the following environment variables
- You can use the`.env` file as a template with the default values shown below
- **Confirm that `ACCESS_TOKEN_SERVER_PORT` matches the port number of `VITE_ACCESS_TOKEN_SERVER_URL` in the `../.env`**

| Environment Variables          | Description                        | Default Value |
| :----------------------------- | :--------------------------------- | ------------: |
| ACCESS_TOKEN_SERVER_PORT       | Port Number of Access Token Server |        `5101` |
| ACCESS_TOKEN_SERVER_API_SECRET | Access Token Server API Secret     |      `secret` |
| ACCESS_TOKEN_SERVER_TOKEN_TTL  | Token Time to Live                 |         `10m` |
