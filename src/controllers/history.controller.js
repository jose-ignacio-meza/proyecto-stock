import History from '../models/history.model.js';
import { isValidObjectId } from 'mongoose';
import Supply from '../models/supply.model.js';
import Printer from '../models/printer.model.js';


export const getHistory = async (req, res) => {
    try {
        const history = await History.find();
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error getting history', error });
    }
};

export const getHistoryById = async (req, res) => {

}

export const createHistoryEvent = async (req, res) => {
    const { eventType, description, printerModel, date, location, supplyType, supplyQuantity, partsChanged, notes } = req.body;

    // Validate required fields
    if (!eventType || !description || !printerModel) {
        return res.status(400).json({ message: 'Event type, description, and printer model are required' });
    }

    try {
        // Create new history event
        const newEvent = new History({
            eventType,
            description,
            printerModel,
            date,
            location,
            supplyType,
            supplyQuantity,
            partsChanged,
            notes
        });
        
        // Save to database
        const savedEvent = await newEvent.save();

        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error });
    }
};
