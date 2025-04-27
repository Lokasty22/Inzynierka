const express = require('express');
const router = express.Router();
const tokenVerification = require('../middleware/tokenVerification');
const { User } = require('../models/user');
const adminController = require('../controllers/adminController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/articles/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.get('/articles/latest', adminController.getLatestArticles);
router.get('/articles/:id', adminController.getArticleById);

router.use(tokenVerification);

router.use(async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || user.role !== 'Admin') {
            return res.status(403).send({ message: 'Dostęp zabroniony. Tylko dla administratorów.' });
        }
        next();
    } catch (error) {
        console.error('Błąd podczas weryfikacji administratora:', error);
        res.status(500).send({ message: 'Błąd serwera' });
    }
});

router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

router.get('/listings', adminController.getAllListings);
router.get('/listings/:id', adminController.getListingById);
router.put('/listings/:id', adminController.updateListing);
router.delete('/listings/:id', adminController.deleteListing);

router.get('/messages', adminController.getAllMessages);
router.get('/messages/:id', adminController.getMessageById);
router.delete('/messages/:id', adminController.deleteMessage);

router.get('/opinions', adminController.getAllOpinions);
router.put('/opinions/:reviewId', adminController.editOpinion);
router.delete('/opinions/:reviewId', adminController.deleteOpinion);

router.get('/statistics', adminController.getStatistics);
router.get('/statistics/listings-per-tutor', adminController.getListingsPerTutor);
router.get('/statistics/total-listings', adminController.getTotalListings);
router.get('/statistics/top-tutors', adminController.getTopTutors);
router.get('/statistics/top-listings', adminController.getTopListings);

router.get('/articles', adminController.getAllArticles);
router.post('/articles', upload.single('image'), adminController.createArticle);
router.put('/articles/:id', upload.single('image'), adminController.updateArticle);
router.delete('/articles/:id', adminController.deleteArticle);

router.get('/payments', adminController.getAllPayments);
router.put('/payments/:id', adminController.updatePaymentStatus);

router.get('/questions', adminController.getAllQuestions);
router.get('/questions/:id', adminController.getQuestionById);
router.delete('/questions/:id', adminController.deleteQuestion);


module.exports = router;
