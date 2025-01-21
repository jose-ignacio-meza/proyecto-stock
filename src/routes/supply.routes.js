import express from 'express';
import {createSupply} from '../controllers/supply.controller.js';

const router = express.Router();

router.get('/', async (req,res)=>{
    try{
        const supplies = await supplyModel.find();
        res.status(200).json(supplies);
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

router.post('/', createSupply);  // Aquí 'createSupply' debe ser una función

export default router;