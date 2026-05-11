import { Router } from 'express';
import { createBook, deleteBook, getAllBooks, getOneBook, updateOneBook } from '#controllers';
import { authenticate, validateBody } from '#middleware';
import { bookSchema } from '#schemas';

const bookRoutes = Router();

bookRoutes.post('/', authenticate, validateBody(bookSchema), createBook);

bookRoutes.get('/', getAllBooks);

bookRoutes.get('/:id', getOneBook);
bookRoutes.put('/:id', authenticate, validateBody(bookSchema), updateOneBook);

bookRoutes.delete('/:id', authenticate, deleteBook);

export default bookRoutes;
