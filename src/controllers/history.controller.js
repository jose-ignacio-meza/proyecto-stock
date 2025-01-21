import History from '../models/history.model.js';

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
