import mongoose from 'mongoose';
import moment from 'moment';

const supplySchema = new mongoose.Schema({
  type: { type: String, required: true }, // Tipo de insumo (tóner, tinta, etc.)
  quantity: { type: Number, required: true }, // Cantidad disponible
  lastUpdated: { type: Date, default: Date.now }, // Fecha de última actualización
});

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
  supplies: [supplySchema], // Lista de insumos
  createdAt: { type: Date, default: Date.now }, // Fecha de creación
  updatedAt: { type: Date, default: Date.now }, // Fecha de última actualización
});

// Middleware para actualizar `updatedAt` automáticamente
printerSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Printer', printerSchema);