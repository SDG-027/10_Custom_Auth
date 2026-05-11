import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '#models';
import type { RequestHandler } from 'express';
import { createToken, getCookieOpts } from '#utils';

import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from '#config';

export const register: RequestHandler = async (req, res) => {
  // Eingabedaten aus dem Request-Body extrahieren
  const { email, password } = req.body;

  // Prüfen, ob ein User mit dieser E-Mail bereits existiert
  // User.exists() gibt null oder ein Objekt mit _id zurück — reicht für eine truthy-Prüfung
  const userExists = await User.exists({ email });

  // Doppelte Registrierung verhindern — HTTP 409 = Konflikt (Ressource existiert bereits)
  if (userExists) throw new Error('User already exists', { cause: { status: 409 } });

  // Passwort niemals im Klartext speichern!
  // genSalt erzeugt einen zufälligen "Salt" — der Kostenfaktor (13) bestimmt,
  // wie rechenintensiv das Hashing ist. Höher = sicherer, aber langsamer.
  const salt = await bcrypt.genSalt(13);

  // Das Passwort wird mit dem Salt gehasht. bcrypt speichert den Salt im Hash-String,
  // sodass beim späteren Vergleich (bcrypt.compare) kein separater Salt nötig ist.
  const hashedPW = await bcrypt.hash(password, salt);

  // User in der DB anlegen — gehashtes PW überschreibt das Klartext-PW aus req.body
  // .toObject() wandelt das Mongoose-Dokument in ein plain JS-Objekt um
  const user = (await User.create({ ...req.body, password: hashedPW })).toObject();

  // Passwort aus dem Objekt entfernen, bevor es an den Client gesendet wird.
  // Destructuring mit Rest: `_` nimmt das PW heraus, `data` enthält den Rest.
  const { password: _, ...data } = user;

  // JWT erstellen — enthält die User-ID als Payload und wird mit dem Secret signiert.
  // Dieser Token beweist dem Server bei späteren Requests, wer der User ist.
  // const token = jwt.sign({ _id: user._id }, process.env.ACCESS_JWT_SECRET!);
  //
  const token = createToken(data);

  // Token als HttpOnly-Cookie setzen — der Browser sendet ihn automatisch mit,
  // aber JavaScript im Browser kann ihn nicht auslesen (XSS-Schutz).
  // secure: true → nur über HTTPS; sameSite: 'none' → nötig für Cross-Origin-Requests
  //
  const cookieOpts = getCookieOpts();
  res.cookie('token', token, cookieOpts);

  // Antwort an den Client: Erfolgsmeldung + User-Daten (ohne PW) + Token im Body.
  // Der Token im Body ist optional — oft reicht der Cookie allein.
  res.json({ msg: 'Success', user: data, token });
};

export const login: RequestHandler = async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({ email }).select('+password').lean();

  if (!user) {
    throw new Error('Invalid credentials', { cause: { status: 401 } });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error('Invalid credentials', { cause: { status: 401 } });
  }

  const { password: _, ...data } = user;

  const token = createToken(data);

  const cookieOpts = getCookieOpts();

  res.cookie('token', token, cookieOpts);

  res.json({ msg: 'Success', user: data, token });
};

export const logout: RequestHandler = async (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};
