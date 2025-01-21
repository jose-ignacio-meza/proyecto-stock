import express from 'express';
import * as supplyController from '../controllers/supply.controller.js';

const router = express.Router();

router.get('/', async (req,res)=>{
    try{
        const supplies = await supplyController.getSyplies();
        res.status(200).json(supplies);
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

router.post('/', async(req,res)=>{
    const {type, quantity, modelPrinter} = req.body;
    let supply = {type, quantity, modelPrinter};
    try{
        const newSupply = await supplyController.createSupply(supply);
        res.status(201).json(newSupply);
    }catch(error){
        res.status(500).json({error: error.message});
    }
});  

export default router;