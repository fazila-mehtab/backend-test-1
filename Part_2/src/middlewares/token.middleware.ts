import jwt from "jsonwebtoken";

export const generateToken = (body: any) => {
  console.log(body);
  return jwt.sign({ body }, "backend", {
    expiresIn: "300s",
  });
};

export const verifyToken = (token: any) => {
  const payload = jwt.verify(token, "backend") as jwt.JwtPayload;
  return payload.body;
};
