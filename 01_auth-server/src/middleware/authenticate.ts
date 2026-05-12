import jwt from 'jsonwebtoken';
import type { RequestHandler } from 'express';

const authenticate: RequestHandler = (req, res, next) => {
  const { token } = req.cookies;

  // frühere Iteration mit hartkodiertem Secret-Vergleich —
  // if ('token=super-secure-secret' !== cookie) { ... }

  // Fehlt der Token, ist der User nicht eingeloggt → 401 Unauthorized
  if (!token) {
    throw new Error('thou shall not pass', { cause: { status: 401 } });
  }

  try {
    // jwt.verify() prüft zwei Dinge gleichzeitig:
    // 1. Wurde der Token mit unserem SECRET signiert? (Integrität)
    // 2. Ist er noch nicht abgelaufen? (falls ein expiresIn gesetzt wurde)
    // Schlägt einer der Checks fehl, wirft verify() einen Fehler.
    const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET!);

    // Alle Infos, die wir in den Token vorher eingebacken haben, können wir hier nun herausholen.
    // Prakischerweise lässt es sich an das Request-Objekt anhängen (achtet auf die TS Deklaration in src/types/index.ts)
    req.user = {
      _id: decoded.sub!.toString(),
      roles: []
    };

    // Token ist gültig → Request darf weiterlaufen
    next();
  } catch (error) {
    // Ungültiger oder manipulierter Token → ebenfalls 401
    throw new Error('thou shall not pass', { cause: { status: 401 } });
  }
};

export default authenticate;
