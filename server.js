const express = require('express');
const mongoose = require('mongoose');
const swotRouter = require('./swotRouter.js');

const app = express();

app.use(express.json()); // For parsing application/json
app.use(swotRouter);

const PORT = 3001;

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from the server!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

mongoose.connect('mongodb+srv://gerasimovpk:QhKU0k7padJ9uoCZ@cluster0.vmwlwsh.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Could not connect to MongoDB', err);
});
