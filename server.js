const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define user schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const User = mongoose.model('User', userSchema);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve login page
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// Serve signup page
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

// Handle signup form submission
app.post('/signup', (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    newUser.save()
        .then(user => {
            res.send('Signup successful');
        })
        .catch(err => {
            console.error(err);
            res.send('Error signing up');
        });
});

// Handle login form submission
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email, password: password })
        .then(user => {
            if (!user) {
                res.send('Invalid email or password');
            } else {
                res.send('Login successful');
            }
        })
        .catch(err => {
            console.error(err);
            res.send('Error logging in');
        });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
