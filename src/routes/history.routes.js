import express from 'express';
import {getHistory,getHistoryById} from "../controllers/history.controller";

const router = express.Router();

//Trae todo el historial de movimientos.
router.get('/load', getHistory);

router.get('/:oid', getHistoryById);