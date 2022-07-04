import User from "../models/User";
import { generateError } from "../utils/error";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    if (user) {
      return res
        .status(404)
        .send("User already exists with username AND/OR email");
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(200).send("User has been created.");
  } catch (err) {
    next(err);
  }
};
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userMongoose = await User.findOne({ username: req.body.username });
    if (!userMongoose) return next(generateError(404, "User not found!"));

    // (err: any, data: any) => {
    //   return new Promise((resolve, reject) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve(data);
    //     }
    //   });
    // }

    let temp = JSON.stringify(userMongoose);
    let user = JSON.parse(temp);

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(generateError(400, "Wrong password or username!"));

    const envjwt = process.env.JWT || "jwt";

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, envjwt);

    const { password, isAdmin, ...otherDetails } = user;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin });
  } catch (err) {
    next(err);
  }
};
