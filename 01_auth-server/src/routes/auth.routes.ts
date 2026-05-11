import { register } from '#controllers';
import { validateBody } from '#middleware';
import { registerSchema } from '#schemas';
import { Router } from 'express';

const authRoutes = Router();

authRoutes.post('/register', validateBody(registerSchema), register); // erstellt neuen Nutzer

authRoutes.post('/login', () => {}); // habe ich einen eintrag in der DB? -> Token

authRoutes.delete('/logout', () => {}); // löscht  Bearer Token

export default authRoutes;
