import express from 'express';
import mongoose from 'mongoose';
import xlsx from 'xlsx';
import { DateTime } from 'luxon';
import printerModel from './model/printer.model.js';
import { engine } from 'express-handlebars';

const app = express();
const PORT = 3000;

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/stock');

// Configurar Handlebars como motor de plantillas
app.engine('handlebars', engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    ifEquals: function(arg1, arg2, options) {
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    }
  }
}));

app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Ruta para cargar datos desde el archivo Excel
app.get('/load-printers', async (req, res) => {
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



// Ruta para mostrar los datos en una vista
app.get('/printers', async (req, res) => {
  try {
    const printers = await printerModel.find();
    res.render('printers', { printers });
  } catch (error) {
    res.status(500).send('Error al obtener los datos: ' + error.message);
  }
});

// Ruta para obtener impresoras por marca
app.get('/printers/brand/:brand', async (req, res) => {
  try {
    const brand = req.params.brand;
    const printers = await printerModel.find({ brand: brand });
    const totalByBrand = await printerModel.countDocuments({ brand: brand});
    res.render('printersBrands',{printers,totalByBrand});
  } catch (error) {
    res.status(500).send('Error al obtener los datos: ' + error.message);
  }
});

// Ruta para obtener impresoras por marca y modelo
app.get('/printers/brand/:brand/model/:model', async (req, res) => {
  try {
    const brand = req.params.brand;
    const model = req.params.model;
    const totalByBrandAndModel = await printerModel.countDocuments({ brand: brand, model: model });
    const printers = await printerModel.find({ brand: brand, model: model});
    res.render('printersModel',{printers,totalByBrandAndModel,model,brand});
  } catch (error) {
    res.status(500).send('Error al obtener los datos: ' + error.message);
  }
});

// Ruta para obtener impresoras por piso
app.get('/printers/floor/:floor', async (req, res) => {
  try {
    const floor = req.params.floor;
    if((floor === 'P-B') || (floor === 'E-P')){
      if(floor === 'P-B'){
        const printers = await printerModel.find({ floor: 'P/B' });
        const totalByFloor = await printerModel.countDocuments({ floor: 'P/B'});
        res.render('printersFloor', { printers, floor ,totalByFloor  });
      }else{
        const printers = await printerModel.find({ floor: 'E/P' });
        const totalByFloor = await printerModel.countDocuments({ floor: 'E/P'});
        res.render('printersFloor', { printers,floor, totalByFloor  });
      }
    }else{
      const printers = await printerModel.find({ floor: floor });
      const totalByFloor = await printerModel.countDocuments({ floor: floor});
      res.render('printersFloor', { printers,floor, totalByFloor });
    }
  } catch (error) {
    res.status(500).send('Error al obtener los datos: ' + error.message);
  }
});

// Ruta para obtener impresoras por edificio
app.get('/printers/building/:dependency', async (req, res) => {
  try {
    const dependency = req.params.dependency;
    const printers = await printerModel.find({ dependency: dependency });
    const totalByBuilding = await printerModel.countDocuments({ dependency: dependency });
    res.render('printersBuilding', { printers,totalByBuilding});
  } catch (error) {
    res.status(500).send('Error al obtener los datos: ' + error.message);
  }
});


app.get('/printers/stats', async (req, res) => {
  try {
    const totalPrinters = await printerModel.countDocuments();
    const totalByBrandAndModel = await printerModel.countDocuments({ brand: 'HP', model: 'MFP-432' });
    const totalByFloor = await printerModel.countDocuments({ floor: '101' });
    const totalByDependency = await printerModel.countDocuments({ dependency: 'D.P.Energia' });

    res.json({
      totalPrinters,
      totalByBrandAndModel,
      totalByFloor,
      totalByDependency
    });
  } catch (error) {
    res.status(500).send('Error al obtener las estadísticas: ' + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});