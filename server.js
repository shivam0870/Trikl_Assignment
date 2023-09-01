const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mern_application', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

//MongoDB schema and model
const itemSchema = new mongoose.Schema({
  name: String,
  description: String
});

const Item = mongoose.model('Item', itemSchema);

// API Endpoints
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/items', async (req, res) => {
  const newItem = new Item(req.body);
  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndUpdate(req.params.id, req.body);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
