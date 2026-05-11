import jwt from 'jsonwebtoken';
import type { RequestHandler } from 'express';

const authenticate: RequestHandler = (req, res, next) => {
  const token = req.header('cookie').split('=')[1];
  if (!token) {
    throw new Error('thou shall not pass', { cause: { status: 401 } }); // wir kennen dich nicht
  }
  // if ('token=super-secure-secret' !== cookie) {
  //   throw new Error('thou shall not pass', { cause: { status: 401 } }); // wir kennen dich nicht
  // }

  try {
    jwt.verify(token, process.env.ACCESS_JWT_SECRET!);
    next();
  } catch (error) {
    console.log(error);
    throw new Error('thou shall not pass', { cause: { status: 401 } });
  }
};

export default authenticate;
