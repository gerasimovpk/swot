const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3001;

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from the server!' });
});

app.post('/api/submit', (req, res) => {
    const answers = req.body;
    res.json({ message: "Successfully received answers!" });
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
