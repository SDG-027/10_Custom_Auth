import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '#models';
import type { RequestHandler } from 'express';

export const register: RequestHandler = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const userExists = await User.exists({ email });
  if (userExists) throw new Error('User already exists', { cause: { status: 409 } }); // conflict

  // Hashing PW

  const salt = await bcrypt.genSalt(13);
  const hashedPW = await bcrypt.hash(password, salt);

  const user = (await User.create({ ...req.body, password: hashedPW })).toObject();
  // console.log(await bcrypt.compare(password, hashedPW));

  const { password: _, ...data } = user;

  const token = jwt.sign({ _id: user._id }, process.env.ACCESS_JWT_SECRET!);

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });

  res.json({ msg: 'Success', user: data, token });
};

export const login: RequestHandler = async (req, res) => {};

export const logout: RequestHandler = async (req, res) => {};
