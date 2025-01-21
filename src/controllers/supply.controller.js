import supplyModel from '../model/supply.model.js';

// Crear un nuevo insumo
export const createSupply = async (req, res) => {
  const { type, quantity, printerId } = req.body;
  try {
    const newSupply = new supplyModel({ type, quantity, printer: printerId });
    await newSupply.save();
    res.status(201).json(newSupply);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un insumo
export const updateSupply = async (req, res) => {
  const { id } = req.params;
  const { type, quantity } = req.body;
  try {
    const updatedSupply = await supplyModel.findByIdAndUpdate(id, { type, quantity }, { new: true });
    res.status(200).json(updatedSupply);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}
