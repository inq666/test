const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'static')))

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/post', require('./routes/post.routes'));

const start = async () => {
  try {
    const url = 'mongodb+srv://inq666:im2eh123@cluster0.s9tzd.mongodb.net/mern?retryWrites=true&w=majority';
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    app.listen(5000, () => console.log('Server is running'));
  } catch (err) {
    console.log('ERROR FROM EXPRESS: ', err);
  }
};

start();
