import mongoose from 'mongoose';
import moment from 'moment-timezone';

// Definición del esquema de impresoras
const printerSchema = new mongoose.Schema({
  floor: { type: String, required: true }, // Piso donde se encuentra la impresora
  office: { type: String, required: true }, // Oficina donde se encuentra la impresora
  dependency: { type: String, required: true }, // Ubicación física de la impresora
  brand: { type: String, required: true }, // Marca de la impresora
  model: { type: String, required: true }, // Modelo de la impresora
  install: { type: Date, required: true }, // Fecha de instalación
  oblea: { type: String, required: true }, // Número de oblea
  ip: { type: String, required: true }, // Dirección IP de la impresora
  serial: { type: String, required: true }, // Número de serie de la impresora
  counter: { type: Number, required: true }, // Contador de impresiones
  fechaCounter: { type: Date, required: true }, // Fecha de la última actualización del contador
  status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' }, // Estado de la impresora
  supplies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Supply' }], // Referencia a los insumos registrados
  createdAt: { type: Date, default: Date.now }, // Fecha de creación
  updatedAt: { type: Date, default: () => moment().tz('America/Sao_Paulo').toDate() }, // Configurar la fecha con UTC-3
});

// Middleware para actualizar `updatedAt` automáticamente
printerSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Printer', printerSchema);