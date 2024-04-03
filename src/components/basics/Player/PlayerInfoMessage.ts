import { AvatarHandle } from "@/components/basics/Avatar/Avatar";
import { RemotePlayerInfo } from "@/components/basics/RemotePlayerGroup/useRemotePlayerGroupStore";
import * as THREE from "three";

export enum RemotePlayerInfoMessageType {
  NEW = "new-player",
  MOVE = "move-player",
  CHANGE = "change-plofile",
}

export default class RemotePlayerInfoMessage {
  playerId: string;
  command: RemotePlayerInfoMessageType;
  remotePlayerInfo: RemotePlayerInfo | undefined;

  private constructor(
    playerId: string,
    command: RemotePlayerInfoMessageType,
    playerInfo: RemotePlayerInfo | undefined,
  ) {
    this.playerId = playerId;
    this.command = command;
    this.remotePlayerInfo = playerInfo;
  }

  public static toPayload = (
    playerId: string,
    type: RemotePlayerInfoMessageType,
    playerName: string,
    avatarType: string,
    avatarHandle: AvatarHandle,
    spotKey: string,
    camera: THREE.Camera,
  ): string => {
    const msg = new RemotePlayerInfoMessage(playerId, type, {
      playerId,
      playerName,
      avatarType,
      controller: avatarHandle.getController(),
      motion: avatarHandle.getCurrentMotion(),
      position: avatarHandle.getPosition(),
      rotation: avatarHandle.getRotation(),
      spotKey,
      cameraDirection: camera.getWorldDirection(new THREE.Vector3()),
      cameraUp: camera.up,
    });
    return (
      msg.playerId +
      " " +
      msg.command +
      " " +
      JSON.stringify(msg.remotePlayerInfo)
    );
  };

  public static fromPayload = (
    payload: string,
  ): RemotePlayerInfoMessage | undefined => {
    if (!payload) {
      return undefined;
    }
    const data = payload.split(" ");
    if (data.length !== 3) {
      return undefined;
    }
    const playerId = data[0];
    const command = data[1];
    const jsonText = data[2];
    const type = command as RemotePlayerInfoMessageType;
    const info = JSON.parse(jsonText) as RemotePlayerInfo;
    if (info.position) {
      info.position = recreateVector3(info.position);
      if (info.rotation) {
        //When converting to JSON, it becomes "_{variable name}", so it is being asserted as `any`.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { _x, _y, _z, _order } = info.rotation as any;
        info.rotation = new THREE.Euler(_x, _y, _z, _order);
      }
      if (info.cameraDirection) {
        info.cameraDirection = recreateVector3(info.cameraDirection);
      }
      if (info.cameraUp) {
        info.cameraUp = recreateVector3(info.cameraUp);
      }
    }

    return new RemotePlayerInfoMessage(playerId, type, info);
  };
}
function recreateVector3(pos: THREE.Vector3) {
  return new THREE.Vector3(pos.x, pos.y, pos.z);
}
