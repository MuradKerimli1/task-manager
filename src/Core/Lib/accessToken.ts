import jwt from "jsonwebtoken";

export const createTokenanSet = (userId: number) => {
  const payload = {
    sub: userId,
  };

  const token = jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN!, {
    expiresIn: "7d",
  });
  return token;
};
