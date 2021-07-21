const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth.middleware');
const fileMiddleware = require('../middleware/file.middleware');
const router = Router();

router.post('/create',
  authMiddleware,
  fileMiddleware.single('file'),
  check('title').isLength({ min: 1 }).withMessage('Title cannot be empty'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0] });
      }
      const imagePath = req.file.path.replace(/\\/g, '/').replace(/static/, '');

      const { title, description } = req.body;
      const post = new Post({
        title,
        description,
        imagePath,
        owner: req.user.userId
      })

      await post.save();

      res.status(201).json({ message: 'Post is created', data: post });
    } catch (err) {
      console.log('ERROR FROM EXPRESS: ', err)
      res.status(500).json({ message: 'Internal Server Error', err });
    }
  });

router.get('/',
  authMiddleware,
  async (req, res) => {
    try {
      const posts = await Post.find({ owner: req.user.userId });
      res.json(posts)
    } catch (err) {
      console.log('ERROR FROM EXPRESS: ', err)
      res.status(500).json({ message: 'Internal Server Error', err });
    }
  })

router.get('/:id',
  authMiddleware,
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.json(post)
    } catch (err) {
      console.log('ERROR FROM EXPRESS: ', err)
      res.status(500).json({ message: 'Internal Server Error', err });
    }
  })

router.delete('/',
  authMiddleware,
  async (req, res) => {
    try {
      const post = await Post.findById(req.body.postId);
      await post.remove();
      res.json({ message: 'Post was deleted' })
    } catch (err) {
      console.log('ERROR FROM EXPRESS: ', err)
      res.status(500).json({ message: 'Internal Server Error', err });
    }
  })

module.exports = router;
