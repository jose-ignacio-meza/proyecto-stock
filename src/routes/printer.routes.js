import express from 'express';
import * as printerController from '../controllers/printer.controller.js';
import { isValidObjectId } from 'mongoose';

const router = express.Router();  // Esto solo se debe declarar una vez

router.get('/', async(req, res) => {
    try{
        const printers = await printerController.getPrinters();
        const total = printers.length;
        res.render('printers', { printers, total });
    }catch(error){
        res.status(500).json({ error: error.message })
    }
});

router.post('/', async(req, res) => { 
    const {brand, model,stock,location,status} = req.body;
    let printer= {brand,model,stock,location,status};
    try {
        const newPrinter = await printerController.createPrinter(printer);
        res.status(201).json(newPrinter);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }
    try {
        const printer = await printerController.modifyPrinter(id, updates);
        res.status(200).json(printer);
    } catch (error) {
        if (error.message === 'Printer not found') {
        res.status(404).json({ error: error.message });
        } else {
        res.status(500).json({ error: error.message });
        }
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }
    try {
        await printerController.deletePrinter(id);
        res.status(204).send('Impresora eliminada correctamente');
    } catch (error) {
        if (error.message === 'Printer not found') {
        res.status(404).json({ error: error.message });
        } else {
        res.status(500).json({ error: error.message });
        }
    }
});

router.get('/brand/:brand', async (req, res) => {
    try {
        const brand = req.params.brand;
        const printers = await printerController.getPrinterByBrand(brand);
        const totalByBrand = printers.length;
        res.render('printersBrands', { printers, totalByBrand });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener impresoras por marca y modelo
router.get('/brand/:brand/model/:model', async (req, res) => {
  try {
    const brand = req.params.brand;
    const model = req.params.model;
    const printers = await printerController.getPrinterByBrandAndModel(brand, model);
    const totalByBrandAndModel= printers.length;
    res.render('printersModel',{printers,totalByBrandAndModel,model,brand});
  } catch (error) {
    res.status(500).send('Error al obtener los datos: ' + error.message);
  }
});

// Ruta para obtener impresoras por piso
router.get('/floor/:floor', async (req, res) => {
  try {
    const floor = req.params.floor;
    let printers= null;
    if((floor === 'P-B') || (floor === 'E-P')){
      if(floor === 'P-B'){
        printers = await printerController.getPrinterByFloor('P/B');
      }else{
        printers = await printerController.getPrinterByFloor('E/P');
      }
    }else{
      printers = await printerController.getPrinterByFloor(floor);
    }
    const totalByFloor = printers.length;
    res.render('printersFloor', { printers,floor, totalByFloor });
  } catch (error) {
    res.status(500).send('Error al obtener los datos: ' + error.message);
  }
});

// Ruta para obtener impresoras por edificio
router.get('/building/:dependency', async (req, res) => {
  try {
    const dependency = req.params.dependency;
    const printers = await printerController.getPrinterByDependency(dependency);
    const totalByBuilding = printers.length;
    res.render('printersBuilding', { printers,totalByBuilding});
  } catch (error) {
    res.status(500).send('Error al obtener los datos: ' + error.message);
  }
});

//Estadisticas de impresoras
router.get('/stats', async (req, res) => {
  try {
    const stats= await printerController.getStats();
    res.render('stats',{stats});
  } catch (error) {
    res.status(500).send('Error al obtener las estadísticas: ' + error.message);
  }
});

export default router;

