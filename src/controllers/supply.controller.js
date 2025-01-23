import supplyModel from '../model/supply.model.js';
import { isValidObjectId } from 'mongoose';
import printerModel from '../model/printer.model.js';
import historyModel from '../model/history.model.js';

export const getSuplies = async (req, res) => {
  try {
    const supplies = await supplyModel.find();
    console.log(supplies);
    res.status(200).render('supplies',{supplies});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Obtener un suplemento por id y renderizar la vista supplyDetail con el historial de movimientos.
export const getSupplyById = async (req, res) => {
  const { oid } = req.params;
  try {
    if (!oid) {
      throw new Error('ID de insumo no proporcionado');
    }
    if(!isValidObjectId(oid)){
      throw new Error('ID de insumo no válido');
    }
    const supply = await supplyModel.findById(oid);
    if (!supply) {
      throw new Error('Insumo no encontrado');
    }
    const history = await historyModel.find({supplyType: supply.type, printerModel: supply.printerModel});
    console.log(supply, history);
    res.status(200).render('supplyDetail', {supply,history});
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Crear un nuevo insumo
export const createSupply = async(req,res) => {
  const { type, quantity, printerModel } = req.body;
  //Valida los campos obligatorios
  if(!type || !quantity || !printerModel){
    res.status(400).send('Faltan campos obligatorios');
  }
  //Nombre final del insumo
  let typefinal= '';
  if(!(type ==='Pieza')){
    //Valida si el modelo de impresora es a color
    const colorPrinters = ['Bizhub C308', 'Bizhub C558', 'MFC-L8900CDW', 'LaserJet Managed MFP E47528'];
    const result= colorPrinters.find((printer)=> printer===printerModel);
    
    if(result){
      let color= req.body.color;
      typefinal= type+' '+color;
    }else{
      typefinal= type+' monocromático';
    }
  }else{
    typefinal= type;
  }
  try {
    const existe= await supplyModel.findOne({type:typefinal, printerModel});
    if(!existe){
      const newSupply = new supplyModel({ type:typefinal, quantity:Number(quantity), printerModel: printerModel });
      await newSupply.save();
      const newHistory = new historyModel({eventType: 'Insumo nuevo', description: 'Insumo nuevo agregado', printerModel: printerModel, supplyType: typefinal, supplyQuantity: quantity});
      await newHistory.save();
      res.status(200).render('newSupply',{newSupply});
    }
    else{
      const id= existe._id;
      let quantityfinal= existe.quantity+ Number(quantity);
      let result= await supplyModel.findByIdAndUpdate(id, {quantity: Number(quantityfinal)}, {new: true});
      const newHistory = new historyModel({eventType: 'Insumo nuevo', description: 'Insumo nuevo agregado', printerModel: printerModel, supplyType: typefinal, supplyQuantity: quantity});
      await newHistory.save();
      res.status(200).render('newSupply',{newSupply:result});
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Actualizar un insumo
export const updateSupply = async (req, res) => {
  const { id } = req.params;
  const { type, quantity } = req.body;
  try {
    const updatedSupply = await supplyModel.findByIdAndUpdate(id, { type, quantity }, { new: true });
    res.status(200).send(updatedSupply);
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

export const loadSupplies = async (req, res) => {
  try{
    const brands = await printerModel.find().distinct('model');
    res.status(200).render('loadSupplies',{brands});
  }catch(error){
    res.status(500).json({ error: error.message });
  }
};