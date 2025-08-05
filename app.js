const path = require('path');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const app = express();
const cors = require('cors');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors());

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI.replace(
  'mongodb+srv://',
  `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@`
);

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ MongoDB connected successfully.");
}).catch((err) => {
    console.log("❌ MongoDB connection error: " + err);
});

const Schema = mongoose.Schema;

const dataSchema = new Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});

const planetModel = mongoose.model('planets', dataSchema);

// ✅ استعلام بيانات الكوكب
app.post('/planet', async (req, res) => {
    try {
        const planetData = await planetModel.findOne({ id: req.body.id });
        if (!planetData) {
            return res.status(404).send("Planet not found. Only IDs 0-9 are valid.");
        }
        res.send(planetData);
    } catch (err) {
        console.error("Error fetching planet data:", err);
        res.status(500).send("Error in Planet Data");
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.get('/os', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "os": OS.hostname(),
        "env": process.env.NODE_ENV
    });
});

app.get('/live', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send({ "status": "live" });
});

app.get('/ready', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send({ "status": "ready" });
});

app.listen(3000, () => {
    console.log("🚀 Server successfully running on port 3000");
});

module.exports = app;
