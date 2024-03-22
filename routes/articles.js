const express = require('express');
const Article = require('../models/Article');
const router = express.Router();

router.route('/new').get((req, res) => {
  res.render('articles/new', { article: new Article() });
  // console.log(new Article());
});

router.route('/').post(async (req, res) => {
  let newArticle = new Article({
    title: req.body.title,
    description: req.body.description,
    markdown: req.body.markdown,
    createdAt: Date.now(),
  });
  try {
    await newArticle.save();
    res.redirect(`/articles/${newArticle.slug}`);
  } catch (error) {
    console.log(error);
    res.render('articles/new', { article: newArticle });
  }
});

router.route('/:slug').get(async (req, res) => {
  const slug = req.params.slug;
  try {
    const article = await Article.findOne({ slug: slug });
    if (!article) {
      return res.redirect('/');
    }
    res.render('articles/show', { article: article });
  } catch (error) {
    console.log(error);
  }
});

router.route('/:id').delete(async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

router.route('/edit/:id').get(async (req, res) => {
  const id = req.params.id;
  try {
    const article = await Article.findById(id);
    if (!article) {
      return res.redirect('/');
    }
    res.render('articles/edit', { article: article });
  } catch (error) {
    console.log(error);
  }
});

router.route('/:id').put(async (req, res) => {
  const id = req.params.id;
  try {
    const article = await Article.findById(id);
    if (!article) {
      return res.redirect('/');
    }
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;
    await article.save();
    res.redirect(`/articles/${article.slug}`);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
