import mongoose from "mongoose";

const supplySchema = new mongoose.Schema({
  type: { type: String, required: true }, // Tipo de insumo (tóner, tinta, etc.)
  quantity: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now },
  printer: { type: mongoose.Schema.Types.ObjectId, ref: 'Printer' }, // Referencia a la impresora asociada
});

export default mongoose.model('Supply', supplySchema);
 