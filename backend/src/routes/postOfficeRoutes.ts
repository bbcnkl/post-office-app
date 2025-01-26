import express from 'express';
import postOfficeController from '../controllers/postOfficeController';
import { body } from 'express-validator';

const router = express.Router();

router.get('/list', postOfficeController.getPostOffices);

router.post('/', 
  body('zipCode').notEmpty().isLength({ min: 5, max: 5 }).withMessage('Zip Code must be 5 characters long'), 
  body('location').notEmpty().withMessage('Location is required'),
  postOfficeController.createPostOffice
)

router.put('/:id', 
  body('zipCode').notEmpty().isLength({ min: 5, max: 5 }).withMessage('Zip Code must be 5 characters long'), 
  body('location').notEmpty().withMessage('Location is required'),
  postOfficeController.updatePostOffice
)

router.delete('/:id', 
  postOfficeController.deletePostOffice
);

export default router;