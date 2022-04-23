import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { db } from '../index.js';
import { User } from '../utils/types.js';

const jwt_secret = process.env.JWT_SECRET!;

export async function authorize(user: User): Promise<string> {
  const token = jwt.sign({ id: user._id }, jwt_secret);

  await db
    .collection('accesstokens')
    .updateOne({ user: user._id }, { $set: { token } }, { upsert: true });

  return token;
}

export async function forbid(token: string): Promise<void> {
  await db.collection('accesstokens').deleteOne({ token });
}

export async function middleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<unknown> {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, jwt_secret) as JwtPayload;

    const accessToken = await db
      .collection('accesstokens')
      .findOne({ user: new ObjectId(payload.id), token: token });

    if (!accessToken) return res.sendStatus(401);

    return next();
  } catch (_) {
    return res.sendStatus(401);
  }
}
