export const defaultAnimationMap: { [name: string]: string } = {
  Idle: "./motions/Happy_Idle.fbx",
  Walking: "./motions/Walking.fbx",
  Running: "./motions/Running.fbx",
  Jump: "./motions/Jumping.fbx",
};

export const defaultAvatarMap: { [name: string]: string } = {
  Amy: "./avatars/amy.vrm",
  Michelle: "./avatars/michelle.vrm",
  Timmy: "./avatars/timmy.vrm",
};

export const defaultAvatarFaceImageMap: { [name: string]: string } = {
  Amy: "./avatar-faces/face-amy.png",
  Michelle: "./avatar-faces/face-michelle.png",
  Timmy: "./avatar-faces/face-timmy.png",
};

export const getAvatarPath = (avatarType: string): string => {
  return defaultAvatarMap[avatarType] ?? "./avatars/michelle.vrm";
};

export const getAvatarFacePath = (avatarType: string): string => {
  return defaultAvatarFaceImageMap[avatarType] ?? "./avatar-faces/no-image.png";
};
