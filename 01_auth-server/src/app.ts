import { PORT } from '#config';
import '#db';
import express from 'express';
import cookieParser from 'cookie-parser';
import { errorHandler, notFoundHandler } from '#middleware';
import { authRoutes, bookRoutes } from '#routes';

const app = express();

app.use(express.json(), cookieParser());

app.use('/auth', authRoutes);
app.use('/books', bookRoutes);

app.use('*splat', notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Auth Server listening on http://localhost:${PORT}`);
});
