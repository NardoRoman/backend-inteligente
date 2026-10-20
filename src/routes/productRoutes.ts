import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

// mergeParams: true permite leer req.params.coleccion desde la ruta padre /api/:coleccion/products
export const productRouter = Router({ mergeParams: true });

productRouter.route('/')
  .get(getProducts)
  .post(createProduct);

productRouter.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);
