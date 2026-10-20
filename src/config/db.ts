import dns from 'node:dns';
import mongoose from 'mongoose';

// Resuelve registros SRV de mongodb+srv:// usando Google/Cloudflare por si el DNS local falla
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', ...dns.getServers()]);
} catch {
  // Continúa con el DNS predeterminado si el entorno no permite cambiarlo
}

export async function connectDB(): Promise<void> {
  const mongoUri = process.env.MONGO_URI?.trim();

  if (!mongoUri) {
    console.error('❌ ERROR: La variable MONGO_URI no está definida en el archivo .env');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Atlas conectado exitosamente: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`❌ Error al conectar con MongoDB Atlas: ${error.message}`);
    process.exit(1);
  }
}
