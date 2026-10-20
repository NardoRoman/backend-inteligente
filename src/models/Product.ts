import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      trim: true,
      default: 'General',
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const INITIAL_SAMPLE_PRODUCTS = [
  {
    nombre: 'Laptop Pro 15 pulgadas',
    categoria: 'Computación',
    precio: 1299.99,
    stock: 15,
  },
  {
    nombre: 'Mouse Inalámbrico Ergonómico',
    categoria: 'Accesorios',
    precio: 29.5,
    stock: 45,
  },
  {
    nombre: 'Teclado Mecánico RGB',
    categoria: 'Accesorios',
    precio: 85.0,
    stock: 22,
  },
  {
    nombre: 'Monitor Gamer 27" QHD 144Hz',
    categoria: 'Monitores',
    precio: 349.0,
    stock: 8,
  },
  {
    nombre: 'Auriculares Bluetooth con Cancelación de Ruido',
    categoria: 'Audio',
    precio: 149.99,
    stock: 18,
  },
];

// Registro de colecciones que ya tuvieron su semillado inicial automático
const seededCollections = new Set<string>();

/**
 * Normaliza el nombre de colección enviado en la URL por el alumno
 * Ej: "inventario-db-liam" -> "inventario_db_liam"
 */
export function sanitizeCollectionName(rawName?: string): string {
  if (!rawName) return 'products';
  const cleaned = rawName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  return cleaned || 'products';
}

/**
 * Obtiene el modelo Mongoose apuntando a la colección exclusiva del alumno.
 * La primera vez que un alumno entra a su colección y está vacía, inserta automáticamente los 5 productos semilla.
 */
export async function getDynamicProductModel(rawCollectionName?: string): Promise<Model<IProduct>> {
  const collectionName = sanitizeCollectionName(rawCollectionName);
  const modelKey = `Product_${collectionName}`;

  const ProductModel =
    (mongoose.models[modelKey] as Model<IProduct>) ||
    mongoose.model<IProduct>(modelKey, productSchema, collectionName);

  // Auto-seed automático la primera vez que se accede a una colección nueva y vacía
  if (!seededCollections.has(collectionName)) {
    seededCollections.add(collectionName);
    const count = await ProductModel.countDocuments();
    if (count === 0) {
      await ProductModel.insertMany(INITIAL_SAMPLE_PRODUCTS);
      console.log(`🌱 Auto-seed completado para la colección "${collectionName}" (5 productos iniciales).`);
    }
  }

  return ProductModel;
}
