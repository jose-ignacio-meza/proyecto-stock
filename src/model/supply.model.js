import mongoose from "mongoose";

const supplySchema = new mongoose.Schema({
  type: { type: String, required: true }, // Tipo de insumo (tóner, tinta, etc.)
  quantity: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now },
  printerModel: { type: String, required: true } // Relacionar con el modelo de impresora
});

export default mongoose.model('Supply', supplySchema);