import express from "express";
import printerRouter from "./routes/printer.routes.js";
import supplyRoutes from './routes/supply.routes.js';
import connectDB from "./config/db.js";
import dotenv from 'dotenv';
import { engine } from 'express-handlebars';
import path from 'path';
import { getPrinters } from './controllers/printer.controller.js';
import {router as configRouter} from './routes/config.routes.js';

dotenv.config();

const app = express();

// Configurar Handlebars como motor de plantillas
app.engine('handlebars', engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    ifEquals: function(arg1, arg2, options) {
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    },
    json: function(context) {
      return context ? JSON.stringify(context).replace(/</g, '\\u003c') : '';
    }
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.resolve('src/views')); // Ruta a las vistas

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Conexión a la base de datos
connectDB();

app.use("/config", configRouter);
app.use("/printers", printerRouter);
app.use('/api/supplies', supplyRoutes);
app.use(express.static('public'));

app.get('/', (req,res) => {
  res.render('home');
});

const port = process.env.PORT || 3000;
const db = process.env.DB;

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});