require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://aerrahmao:Uffn8DLs3YOwkFYa@cluster0.dcz6p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = process.env.DB_NAME || 'PJENT';
const COLLECTION_NAME = process.env.COLLECTION_NAME || 'Financing_data';

mongoose.connect(MONGO_URI, { dbName: DB_NAME })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

app.use(express.json());

const financingSchema = new mongoose.Schema({}, { strict: false });
const FinancingData = mongoose.model('FinancingData', financingSchema, COLLECTION_NAME);

app.get('/fetchFinancingData', async (req, res) => {
    try {
        const financingData = await FinancingData.find({});
        
        // Optional: Normalize field names if needed (fix escaped quotes or nested field issues)
        const cleanedData = financingData.map(doc => {
            let cleanDoc = {};
            for (let key in doc.toObject()) {
                // Clean field names if they have escaped quotes or other unwanted characters
                let newKey = key.replace(/\\"/g, '"'); // Fix escaped quotes
                cleanDoc[newKey] = doc[key];
            }
            return cleanDoc;
        });

        res.json({ results: cleanedData });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
