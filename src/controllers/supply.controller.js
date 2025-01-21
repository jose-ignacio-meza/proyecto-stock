import supplyModel from '../model/supply.model.js';

export const getSyplies = async (req, res) => {
  try {
    const supplies = await supplyModel.find();
    res.status(200).json(supplies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSupplyById = async (req, res) => {
  const { id } = req.params;
  try {
    const supply = await supplyModel.findById(id);
    res.status(200).json(supply);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Crear un nuevo insumo
export const createSupply = async(supplies) => {
  console.log("LLEGO ACA");
  const { type, quantity, printerModel } = supplies;
  try {
    const newSupply = new supplyModel({ type, quantity, printerModel: printerModel });
    await newSupply.save();
    return newSupply;
  } catch (error) {
    return error.message;
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

export const deleteSupply = async (req, res) => {
  const { id } = req.params;
  try {
    await supplyModel.findByIdAndDelete(id);
    res.status(204).send('Insumo eliminado correctamente');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
