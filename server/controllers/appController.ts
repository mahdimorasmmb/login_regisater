import { NextFunction, Request, Response } from "express";
import UserModel, { User } from "../model/User.model";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { rejects } from "assert";
import Jwt from "jsonwebtoken";
import config from "../config/config";
import otpGenerator from "otp-generator";

interface UserRequest extends Request {
  user: {
    userId: string;
    username: string;
    iat: number;
    exp: number;
  };
}

export async function verifyUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username } = req.method === "GET" ? req.query : req.body;

    let exist = await UserModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: "Can't finde User!" });

    next();
  } catch (error) {
    return res.status(404).send({ erro: "Authentication Error" });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { username, password, profile, email } = req.body;

    const existUsername = new Promise<void>((resolve, reject) => {
      UserModel.findOne({ username })
        .then((res) => {
          if (res) reject();
        })
        .catch((error) => {
          rejects(error);
        });
      resolve();
    });

    const existEmail = new Promise<void>((resolve, reject) => {
      UserModel.findOne({ email })
        .then((res) => {
          if (res) reject();
        })
        .catch((error) => {
          rejects(error);
        });
      resolve();
    });

    Promise.all([existUsername, existEmail])
      .then(() => {
        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const user = new UserModel({
                username,
                password: hashedPassword,
                profile: profile || "",
                email,
              });

              user
                .save()
                .then((result) =>
                  res.status(201).send({ msg: "User Register Successfull" })
                )
                .catch((error) => res.status(500).send({ error, msg: "User" }));
            })
            .catch((error) => {
              return res.status(500).send({
                error: "Enable to hashed password",
              });
            });
        }
      })
      .catch((error) => {
        console.log(error);

        return res.status(500).send({ error, msg: "All" });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  try {
    UserModel.findOne({ username })
      .then((user) => {
        if (user?.password)
          bcrypt
            .compare(password, user?.password)
            .then((passwordCheck) => {
              if (!passwordCheck)
                return res.status(400).send({ error: "Dont't have Password" });

              const token = Jwt.sign(
                {
                  userId: user._id,
                  username: user.username,
                },
                config.JWT_SECRET,
                { expiresIn: "24h" }
              );
              return res.status(200).send({
                msg: "Logni Successful...!",
                username: user.username,
                token,
              });
            })
            .catch((error) => {
              return res.status(400).send({ error: "Password does not Match" });
            });
      })
      .catch((err) => {
        return res.status(404).send({ error: "User not Found" });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

export async function getUser(req: Request, res: Response) {
  const { username } = req.params;

  if (!username) return res.status(501).send({ error: "Invalid Username" });

  UserModel.findOne({ username })
    .then((user) => {
      if (!user)
        return res.status(501).send({ error: "Couldn,t Find the User" });

      const { password, ...rest } = Object.assign({}, user.toJSON());
      return res.status(201).send(rest);
    })
    .catch((error) => res.status(500).send({ error }));
}

export async function updateUser(req: Request, res: Response) {
  // const id = req.query.id;

  const { userId } = (req as UserRequest).user;

  if (userId) {
    const body = req.body;

    UserModel.updateOne({ _id: userId }, body)
      .then((data) => {
        return res.status(201).send({ msg: "Record Updated...!" });
      })
      .catch((error) => res.status(401).send({ msg: "User not Fpund" }));
  }
}

export async function generateOTP(req: Request, res: Response) {
  req.app.locals.OTP = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
}

export async function verifyOTP(req: Request, res: Response) {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code as string)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return res.status(201).send({ msg: "Verify Successfully!" });
  }

  return res.status(400).send({ error: "Invalid OTP" });
}
export async function createResetSession(req: Request, res: Response) {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag:req.app.locals.resetSession });
  }
  return res.status(440).send({ error: "Session expired!" });
}

export async function resetPassword(req: Request, res: Response) {
  try {
    if (!req.app.locals.resetSession)
      return res.status(440).send({ error: "Session expired!" });
    const { username, password } = req.body;

    try {
      UserModel.findOne({ username })
        .then((user) => {
          bcrypt
            .hash(password, 10)
            .then((hashPassword) => {
              UserModel.updateOne({
                username: user?.username,
                password: hashPassword,
              })
                .then((data) =>
                  res.status(201).send({ msg: "Record Updated ..." })
                )
                .catch((error) => {
                  throw error;
                });
            })
            .catch((e) => {
              return res.status(500).send({
                error: "Enable to hashed password",
              });
            });
        })
        .catch((error) => {
          return res.status(404).send({ error: "Username not Found" });
        });
    } catch (error) {
      return res.status(404).send({ error });
    }
  } catch (error) {
    return res.status(404).send({ error });
  }
}
