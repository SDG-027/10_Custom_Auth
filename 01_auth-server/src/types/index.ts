/* For custom types used in more than one module */

import type { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        roles: string[];
      };
    }
  }
}
