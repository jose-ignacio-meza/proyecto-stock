import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  eventType: { type: String, required: true }, // Tipo de evento (cambio de lugar, cambio de tóner, etc.)
  description: { type: String, required: true }, // Descripción del evento
  date: { type: Date, default: Date.now }, // Fecha del evento
  printerModel: { type: String, required: true }, // Modelo de la impresora involucrada
  location: { type: String }, // Ubicación de la impresora (si aplica)
  supplyType: { type: String }, // Tipo de suministro (si aplica)
  supplyQuantity: { type: Number }, // Cantidad de suministro (si aplica)
  partsChanged: { type: String }, // Piezas cambiadas (si aplica)
  notes: { type: String } // Notas adicionales
});

export default mongoose.model('History', historySchema);