import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

class HistoryDAO {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
        this.collection = this.dbConnection.collection('history');
    }

    async getAllHistory() {
        try {
            const rows = await this.collection.find().toArray();
            return rows;
        } catch (error) {
            throw new Error('Error fetching history: ' + error.message);
        }
    }

    async getHistoryById(id) {
        try {
            const row = await this.collection.findOne({ _id: new MongoClient.ObjectId(id) });
            return row;
        } catch (error) {
            throw new Error('Error fetching history by ID: ' + error.message);
        }
    }

    async addHistory(history) {
        try {
            const result = await this.collection.insertOne(history);
            return result.insertedId;
        } catch (error) {
            throw new Error('Error adding history: ' + error.message);
        }
    }

    async updateHistory(id, history) {
        try {
            await this.collection.updateOne({ _id: new MongoClient.ObjectId(id) }, { $set: history });
        } catch (error) {
            throw new Error('Error updating history: ' + error.message);
        }
    }

    async deleteHistory(id) {
        try {
            await this.collection.deleteOne({ _id: new MongoClient.ObjectId(id) });
        } catch (error) {
            throw new Error('Error deleting history: ' + error.message);
        }
    }
}

export default HistoryDAO;

export async function connectToDatabase(uri) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    return client.db(process.env.DB);
}