import printerModel from '../model/printer.model.js';
import supplyModel from '../model/supply.model.js';

// Obtener todas las impresoras con sus insumos
export const getPrinters = async () => {
  try {
    const printers = await printerModel.find().populate('supplies');
    return (printers);
  } catch (error) {
    return({ error: error.message });
  }
};

// Crear una nueva impresora
export const createPrinter = async (newPrinter) => {
  try {
    const printer = new printerModel(newPrinter);
    await printer.save();
    return printer;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Modificar una impresora existente
export const modifyPrinter = async (id, updates) => {
  try {
    const printer = await printerModel.findById(id);
    if (!printer) {
      throw new Error('Printer not found');
    }
    const updatedPrinter = await printerModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    return updatedPrinter;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Eliminar una impresora
export const deletePrinter = async (id) => {
  try {
    const printer = await printerModel.findById(id);
    if (!printer) {
      throw new Error('Printer not found');
    }
    const result = await printerModel.findByIdAndDelete(id);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getPrinterByOblea = async (id) => {  
  try {
    const printer = await printerModel.findOne({ oblea: id });
    return printer;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getPrinterBySerial = async (id) => {  
  try {
    const printer = await printerModel.findOne({ serial: id });
    return printer;
  }catch(error){
    throw new Error(error.message);
  }
}

export const getPrinterByIp = async (id) => {  
  try {
    const printer = await printerModel.findOne({ ip: id });
    return printer;
  }catch(error){
    throw new Error(error.message);
  }
}

export const getPrinterByBrand = async (id) => {  
  try {
    const printer = await printerModel.find({ brand: id });
    return printer;
  }
  catch(error){
    throw new Error(error.message);
  }
}

export const getPrinterByBrandAndModel = async (brand,model) => {  
  try {
    const printers = await printerModel.find({ brand: brand, model: model});
    return printers;
  }
  catch(error){
    throw new Error(error.message);
  }
}

export const getPrinterByFloor = async (id) => {  
  try {
    const printers = await printerModel.find({ floor: id });
    return printers;
  }
  catch(error){
    throw new Error(error.message);
  }
}

export const getPrinterByDependency = async (id) => {  
  try {
    const printer = await printerModel.find({ dependency: id });
    return printer;
  }
  catch(error){
    throw new Error(error.message);
  }
}

export const getStats= async() => {
  try {

    // Obtener la lista de marcas únicas
    const brandsList = await printerModel.distinct('brand');
    
    // Crear un objeto para almacenar la cantidad de impresoras por marca
    const brandCounts = {};

    // Recorrer la lista de marcas y contar las impresoras de cada marca
    for (const brand of brandsList) {
      const count = await printerModel.countDocuments({ brand: brand });
      brandCounts[brand] = count;
    }

    // Obtener la lista de modelos únicos
    const modelsList = await printerModel.distinct('model');
    
    // Recorrer la lista de modelos y contar las impresoras de cada modelo
    for (const model of modelsList) {
      const count = await printerModel.countDocuments({ model: model });
      modelCounts[model] = count;
    }

    // Crear el objeto de estadísticas
    const stats = {
      models: modelCounts,
      brands: brandCounts
    };
    
    return stats;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Obtener impresoras por oficina
export const getPrinterByOffice = async (id) => {  
  try {
    const printer = await printerModel.find({ office: id });
    return printer;
  }
  catch(error){
    throw new Error(error.message);
  }
}

