import cors from "cors";
import express from "express";
import { AccessToken } from "livekit-server-sdk";

// Function to create a token, now accepts roomName and participantName as arguments
const createToken = async (roomName, participantName) => {
  const at = new AccessToken("devkey", "secret", {
    identity: participantName,
    // Token expires after 10 minutes
    ttl: "10m",
  });
  at.addGrant({ roomJoin: true, room: roomName });

  return await at.toJwt();
};

const app = express();
app.use(cors());

const port = 3001;

// Modify GET request handler to extract roomName and participantName from query parameters
app.get("/getToken", async (req, res) => {
  const { roomName, participantName } = req.query;

  // Add parameter validation
  if (!roomName || !participantName) {
    return res
      .status(400)
      .send("Both roomName and participantName are required.");
  }

  res.send(await createToken(roomName, participantName));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
