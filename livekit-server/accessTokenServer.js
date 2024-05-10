import cors from "cors";
import "dotenv/config";
import express from "express";
import { AccessToken } from "livekit-server-sdk";

const apiKey = process.env.ACCESS_TOKEN_SERVER_API_KEY;
const apiSecret = process.env.ACCESS_TOKEN_SERVER_API_SECRET;
const tokenTimeToLive = process.env.ACCESS_TOKEN_SERVER_TOKEN_TTL;
const port = Number(process.env.ACCESS_TOKEN_SERVER_PORT);

const createToken = async (roomName, participantName) => {
  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
    ttl: tokenTimeToLive,
  });
  at.addGrant({ roomJoin: true, room: roomName });
  return await at.toJwt();
};

const app = express();
app.use(cors());

app.get("/getToken", async (req, res) => {
  const { RoomName, ParticipantName } = req.query;

  if (!RoomName || !ParticipantName) {
    return res
      .status(400)
      .send("Both roomName and participantName are required.");
  }

  const accessToken = await createToken(RoomName, ParticipantName);
  res.send({
    RoomName: RoomName,
    ParticipantName: ParticipantName,
    AccessToken: accessToken,
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
