import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { User } from "../model/User.model";

export interface UserRequest extends Request {
  user: string | jwt.JwtPayload;
}

export default async function Auth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).send({ msg: "Authentication Failed!" });

    const decodedToken = jwt.verify(token, config.JWT_SECRET);

    console.log(decodedToken);

    (req as UserRequest).user = decodedToken;

    next();
  } catch (error) {
    res.status(401).send({ msg: "Authentication Failed! 2" });
  }
}

export function localVariables(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next()
}
