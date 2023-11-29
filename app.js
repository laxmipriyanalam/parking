const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
//const cors = require('cors'); // Import the cors middleware


const app = express();
const PORT = 3000;
const uri = 'mongodb://localhost:27017/parkingdb';
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Change * to your front-end server URL in production
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

//app.use(cors()); // Enable CORS


app.use(bodyParser.json());

// Connect to MongoDB
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }
    console.log('Connected to MongoDB');
});

// Insert data
app.post('/insert', async (req, res) => {
    const { carNumber, parkingSlot } = req.body;
    const parkingCollection = client.db('parkingdb').collection('parking');

    try {
        const result = await parkingCollection.insertOne({ carNumber, parkingSlot });
        res.json({ message: 'Data inserted successfully', insertedId: result.insertedId });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Retrieve data
app.get('/retrieve', async (req, res) => {
    const parkingCollection = client.db('parkingdb').collection('parking');

    try {
        const data = await parkingCollection.find({}).toArray();
        res.json({ data });
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete data
app.delete('/delete/:id', async (req, res) => {
    const parkingCollection = client.db('parkingdb').collection('parking');
    const id = req.params.id;

    try {
        const result = await parkingCollection.deleteOne({ _id: ObjectId(id) });
        if (result.deletedCount === 1) {
            res.json({ message: 'Data deleted successfully' });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
