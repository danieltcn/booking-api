import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { generateError } from "./error";

export const verifyToken = (req: Request, res: Response, next: NextFunction, callback: any) => {
  const envJwt = process.env.JWT || 'jwt';
  const token = req.cookies.access_token;

  if (!token) {
    return next(generateError(401, "You are not authenticated!"));
  }

  jwt.verify(token, envJwt, (error: any, user: any) => {
    if (error) return next(generateError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(generateError(403, "You are not authorized!"));
    }
  });
};

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(generateError(403, "You are not admin!"));
    }
  });
};
