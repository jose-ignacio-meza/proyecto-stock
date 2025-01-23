import mongoose from "mongoose";
import moment from 'moment-timezone';

const supplySchema = new mongoose.Schema({
  type: { type: String, required: true }, // Tipo de insumo (tóner, tinta, etc.)
  quantity: { type: Number, required: true },
  lastUpdated: { type: Date, default: () => moment().tz('America/Sao_Paulo').toDate() }, // Configurar la fecha con UTC-3
  printerModel: { type: String, required: true } // Relacionar con el modelo de impresora
});

export default mongoose.model('Supply', supplySchema);