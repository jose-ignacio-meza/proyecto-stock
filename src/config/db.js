import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('La variable MONGO_URI no está definida en el archivo .env');
    }

    // Conectar a MongoDB
    await mongoose.connect(mongoUri, {
    });

    console.log('Conexión a MongoDB exitosa');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1); // Salir si no se puede conectar
  }
};

export default connectDB;

