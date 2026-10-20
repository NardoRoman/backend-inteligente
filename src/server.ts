import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { productRouter } from './routes/productRoutes.js';
import { seedCollection, getProducts } from './controllers/productController.js';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Limpia barras diagonales dobles (//) por si el alumno pone una "/" al final de su VITE_API_URL:
// Ej: https://.../api/inventario-db-juan//products -> /api/inventario-db-juan/products
app.use((req, _res, next) => {
  req.url = req.url.replace(/\/+/g, '/');
  next();
});

// Endpoint de salud
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', mode: 'intelligent-multi-collection', timestamp: new Date().toISOString() });
});

// 1. Ruta tradicional (/api/products)
app.get('/api/seed', seedCollection);
app.post('/api/seed', seedCollection);
app.use('/api/products', productRouter);

// 2. Ruta inteligente por alumno/colección (/api/:coleccion/products)
// Ej: VITE_API_URL=https://inventario-app-backend-intelligent.onrender.com/api/inventario-db-liam/
app.get('/api/:coleccion', getProducts);
app.get('/api/:coleccion/seed', seedCollection);
app.post('/api/:coleccion/seed', seedCollection);
app.use('/api/:coleccion/products', productRouter);

// Manejo de ruta no encontrada
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Ruta de API no encontrada' });
});

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Backend Inteligente escuchando en http://localhost:${PORT}`);
    console.log(`📡 Uso por alumno: http://localhost:${PORT}/api/inventario-db-nombrealumno/products`);
  });
}

startServer();
