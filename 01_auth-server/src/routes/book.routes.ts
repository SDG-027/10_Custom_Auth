import { Router } from 'express';
import { createBook, deleteBook, getAllBooks, getOneBook, updateOneBook } from '#controllers';
import { validateBody } from '#middleware';
import { bookSchema } from '#schemas';

const bookRoutes = Router();

bookRoutes.post('/', validateBody(bookSchema), createBook);
bookRoutes.get('/', getAllBooks);
bookRoutes.get('/:id', getOneBook);
bookRoutes.put('/:id', validateBody(bookSchema), updateOneBook);
bookRoutes.delete('/:id', deleteBook);

export default bookRoutes;
