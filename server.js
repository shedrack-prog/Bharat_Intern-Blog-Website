const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const app = express();

const articlesRouter = require('./routes/articles');
const Article = require('./models/Article');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/articles', articlesRouter);

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  try {
    const articles = await Article.find({}).sort({ createdAt: -1 });

    res.render('articles/index', { articles });
  } catch (error) {
    console.log(error);
  }
});
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(port, () => {
      console.log(`App listening on port: ${port}!`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
