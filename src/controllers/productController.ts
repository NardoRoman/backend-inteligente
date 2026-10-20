import { Request, Response } from 'express';
import {
  getDynamicProductModel,
  sanitizeCollectionName,
  INITIAL_SAMPLE_PRODUCTS,
} from '../models/Product.js';

// @desc    Obtener todos los productos de la colección del alumno
// @route   GET /api/products  o  GET /api/:coleccion/products
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const Product = await getDynamicProductModel(req.params.coleccion);
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

// @desc    Obtener un producto por ID
// @route   GET /api/products/:id  o  GET /api/:coleccion/products/:id
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const Product = await getDynamicProductModel(req.params.coleccion);
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Producto no encontrado' });
      return;
    }
    res.status(200).json(product);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al buscar el producto', error: error.message });
  }
};

// @desc    Crear un nuevo producto
// @route   POST /api/products  o  POST /api/:coleccion/products
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, categoria, precio, stock } = req.body;

    if (!nombre || precio === undefined || stock === undefined) {
      res.status(400).json({ message: 'Nombre, precio y stock son campos requeridos' });
      return;
    }

    const Product = await getDynamicProductModel(req.params.coleccion);
    const newProduct = await Product.create({
      nombre,
      categoria: categoria || 'General',
      precio: Number(precio),
      stock: Number(stock),
    });

    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(400).json({ message: 'Error al crear el producto', error: error.message });
  }
};

// @desc    Actualizar un producto existente
// @route   PUT /api/products/:id  o  PUT /api/:coleccion/products/:id
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const Product = await getDynamicProductModel(req.params.coleccion);
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      res.status(404).json({ message: 'Producto no encontrado para actualizar' });
      return;
    }

    res.status(200).json(updatedProduct);
  } catch (error: any) {
    res.status(400).json({ message: 'Error al actualizar el producto', error: error.message });
  }
};

// @desc    Eliminar un producto
// @route   DELETE /api/products/:id  o  DELETE /api/:coleccion/products/:id
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const Product = await getDynamicProductModel(req.params.coleccion);
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      res.status(404).json({ message: 'Producto no encontrado para eliminar' });
      return;
    }

    res.status(200).json({ message: 'Producto eliminado exitosamente', id: req.params.id });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
  }
};

// @desc    Restaurar los 5 productos semilla de un alumno (se puede abrir directo en el navegador)
// @route   GET/POST /api/:coleccion/seed
export const seedCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const collectionName = sanitizeCollectionName(req.params.coleccion);
    const Product = await getDynamicProductModel(collectionName);
    await Product.deleteMany({});
    const inserted = await Product.insertMany(INITIAL_SAMPLE_PRODUCTS);
    res.status(200).json({
      message: `✅ Colección "${collectionName}" reiniciada con ${inserted.length} productos de prueba.`,
      collection: collectionName,
      products: inserted,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al sembrar datos', error: error.message });
  }
};
