const express = require('express');
const router = express.Router();
const multer = require('multer');
const tokenVerification = require('../middleware/tokenVerification');
const userController = require('../controllers/userController');
const {Listing} = require("../models/listing");
const { Question } = require('../models/questions');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.get('/:userId/listings', tokenVerification, async (req, res) => {
    try {
        const listings = await Listing.find({ teacher: req.params.userId });
        res.json(listings);
    } catch (err) {
        res.status(500).json({ message: 'Błąd serwera' });
    }
});

router.get('/:userId/questions', tokenVerification, async(req, res) => {
    try{
        const questions = await Question.find({student: req.params.userId}).populate('student', 'firstName lastName');
        res.json(questions);
    } catch(err){
        res.status(500).json({message: 'Błąd serwera'});
    }
})

router.post('/', userController.registerUser);
router.get('/me', tokenVerification, userController.getUserProfile);
router.put('/me', tokenVerification, upload.single('profilePicture'), userController.updateUserProfile);
router.put('/change-password', tokenVerification, userController.changePassword);
router.delete('/me', tokenVerification, userController.deleteUser);
router.get('/:id', userController.getUserProfileById);



module.exports = router;
