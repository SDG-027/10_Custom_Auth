import jwt from 'jsonwebtoken';
import { ACCESS_JWT_SECRET, ACCESS_TOKEN_TTL } from '#config';
import type { Types } from 'mongoose';

type UserData = {
  _id: Types.ObjectId;
};

const createToken = (userData: UserData) => {
  const options = {
    expiresIn: ACCESS_TOKEN_TTL,
    subject: userData._id.toString()
  };
  const token = jwt.sign({}, ACCESS_JWT_SECRET, options);

  return token;
};

const getCookieOpts = () => ({
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  expires: new Date(Date.now() + ACCESS_TOKEN_TTL * 1000)
});

export { createToken, getCookieOpts };
