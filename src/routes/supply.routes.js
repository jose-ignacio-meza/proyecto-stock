import express from 'express';
import {createSupply, getSuplies, getSupplyById, updateSupply, deleteSupply, loadSupplies} from '../controllers/supply.controller.js';

const router = express.Router();

router.get('/load', loadSupplies);

router.get('/:oid', getSupplyById);

router.put('/:oid', updateSupply);

router.delete('/:oid', deleteSupply);

router.get('/', getSuplies);

router.post('/', createSupply); 


export default router;