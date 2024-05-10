import axios from "axios";
import * as base62 from "base62-ts";
import { v4 as uuidv4 } from "uuid";

export default class MultiplayUtil {
  static getAccessToken = async (
    accessTokenUrl: string,
    roomName: string,
    userName: string,
  ): Promise<string | undefined> => {
    if (!roomName) return undefined;
    const url =
      accessTokenUrl + "?RoomName=" + roomName + "&ParticipantName=" + userName;
    console.debug("Get Access Token: %s", url);
    try {
      const res = await axios.get(url);
      return res.data.AccessToken;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          `Error: HTTP Status: ${error.response?.status} ${error.message}`,
        );
      }
      return undefined;
    }
  };

  static generateShortUUID = (): string => {
    const id = uuidv4().replace(/-/g, "");
    const partialHex = id.substring(0, 12);
    const num = parseInt(partialHex, 16);
    const encoded = base62.encode(num);
    return encoded;
  };
}
