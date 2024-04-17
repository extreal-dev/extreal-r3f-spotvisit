# Spot Visit

## How to Start Spot Visit

### Start Livekit Server

[Download and install latest release of Livekit from here](https://github.com/livekit/livekit/releases "releases of Livekit")  
 To start Livekit Server, execute the following command.

```text
livekit-server --dev
```

### Start Access Token Server for Livekit

Access Token Server generates access token for Livekit Server.  
To start Access Token Server, execute the following command.

```text
cd livekit-server
npm run start
```

For datails, refer to the `./livekit-server/README.md`

### Start API Mock Server

Backend API is provided as mock server.  
To start API Mock Server, execute the following command.

```text
npm run api-mock
```

### Start Spot Visit

```text
npm run dev
```

## Optional Configuration

### (Optional) Create Environment Variable Files with Template

- Create environment variable files as needed(e.g., `.env.local`, `.env.development`)
- You need to define the following environment variables
- You can use the`.env` file as a template with the default values shown below
- **Confirm that the port number of `VITE_ACCESS_TOKEN_SERVER_URL` matches the `ACCESS_TOKEN_SERVER_PORT` in the `./livekit/.env`**

| Environment Variables                | Description                           |                    Default Value |
| :----------------------------------- | :------------------------------------ | -------------------------------: |
| VITE_LIVEKIT_SERVER_URL              | Livekit Server URL                    |            `ws://localhost:7880` |
| VITE_ACCESS_TOKEN_SERVER_URL         | Access Token Server URL               | `http://localhost:5101/getToken` |
| VITE_API_MOCK_SERVER_URL             | API Mock Server URL                   |          `http://localhost:5100` |
| VITE_API_MOCK_SERVER_REQUEST_TIMEOUT | API Mock Server Timeout (millisecond) |                          `15000` |

### (Optional) Generate API client code (when you edit `openapi.yaml`)

To generate API client code, execute the following command.

```text
npm run api-codegen
```
