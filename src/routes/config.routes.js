import express from 'express';
import xlsx from 'xlsx';
import { DateTime } from 'luxon';
import printerModel from '../model/printer.model.js';

export const router = express.Router();


// Ruta para cargar datos desde el archivo Excel
router.get('/load-printers', async (req, res) => {
  try {
    const filePath = './src/Impresoras.xlsx';
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    let printers = xlsx.utils.sheet_to_json(sheet, { raw: false, dateNF: 'M/d/yy' });

    // Imprimir los nombres de las columnas
    console.log(Object.keys(printers[0]));

    // Limpiar los datos para eliminar comillas innecesarias y convertir fechas
    printers = printers.map(printer => {
      const cleanedPrinter = {};
      for (const key in printer) {
        if (typeof printer[key] === 'string') {
          cleanedPrinter[key] = printer[key].replace(/['"]+/g, '').trim();
        } else {
          cleanedPrinter[key] = printer[key];
        }
      }
      // Imprimir el valor de 'fechaCounter' antes de la conversión
      console.log(`Original fechaCounter: ${cleanedPrinter.fechaCounter}`);

      // Convertir la fecha de 'fechaCounter' al formato correcto
      if (cleanedPrinter.fechaCounter) {
        const fechaCounterDate = DateTime.fromFormat(cleanedPrinter.fechaCounter, 'M/d/yy').toJSDate();
        if (!isNaN(fechaCounterDate.getTime())) {
          cleanedPrinter.fechaCounter = fechaCounterDate;
        } else {
          cleanedPrinter.fechaCounter = null; // O manejar el error de otra manera
        }
      }

      // Convertir la fecha de 'install' al formato correcto
      if (cleanedPrinter.install) {
        console.log('antes ' + cleanedPrinter.install);
        const installDate = DateTime.fromFormat(cleanedPrinter.install, 'M/d/yy').toJSDate();
        console.log('Despues ' + installDate);
        if (!isNaN(installDate.getTime())) {
          cleanedPrinter.install = installDate;
        } else {
          cleanedPrinter.install = 0; // O manejar el error de otra manera
        }
      }
      console.log(cleanedPrinter);
      return cleanedPrinter;
    });

    // Filtrar los datos para asegurarse de que todos los campos requeridos estén presentes
    printers = printers.filter(printer => 
        printer.floor && printer.office && printer.dependency && printer.brand && printer.model && printer.install && printer.oblea && printer.ip && printer.serial && printer.counter && printer.fechaCounter
    );

    // Insertar los datos en MongoDB
    await printerModel.insertMany(printers);
    res.send('Datos cargados exitosamente');
    } catch (error) {
    res.status(500).send('Error al cargar los datos: ' + error.message);
    }
});