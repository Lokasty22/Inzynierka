const express = require('express');
const router = express.Router();
const { addListing, getListings, getListingById, addReview, editReview, deleteReview, promoteListing } = require('../controllers/listingController');
const tokenVerification = require('../middleware/tokenVerification');
const {Listing} = require("../models/listing");

router.post('/', tokenVerification, addListing);

router.get('/:id', getListingById);

router.get('/', async (req, res) => {
    try {
        const { subject, city, state, pricePerHour, createdAt} = req.query;

        
        const query = {};
        if (subject) query.subject = subject;
        if (city) query.city = city;
        if(state) query.state = state;
        if(pricePerHour) query.pricePerHour = pricePerHour;
        if(createdAt) query.createdAt = createdAt;
        const listings = await Listing.find(query).populate('teacher', 'firstName lastName profilePicture state city').exec();
        res.json(listings);
    } catch (error) {
        console.error("Błąd podczas pobierania ogłoszeń:", error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
});

// Tworzenie nowego ogłoszenia

router.post('/', tokenVerification, async (req, res) => {
    try {
        const listing = new Listing({
            ...req.body,
            teacher: req.user._id,
        });
        await listing.save();
        res.status(201).json(listing);
    } catch (err) {
        res.status(400).json({ message: 'Błąd podczas tworzenia ogłoszenia.', error: err.message });
    }
});

// Pobieranie szczegółów ogłoszenia
router.get('/:id', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('teacher');
        if (!listing) {
            return res.status(404).json({ message: 'Ogłoszenie nie zostało znalezione.' });
        }
        res.json(listing);
    } catch (err) {
        res.status(500).json({ message: 'Błąd serwera' });
    }
});

router.put('/:id', tokenVerification, async (req, res) => {
    try {
        const listing = await Listing.findOneAndUpdate(
            { _id: req.params.id, teacher: req.user._id },
            req.body,
            { new: true }
        );
        if (!listing) {
            return res.status(404).json({ message: 'Ogłoszenie nie zostało znalezione.' });
        }
        res.json(listing);
    } catch (err) {
        res.status(400).json({ message: 'Błąd podczas aktualizacji ogłoszenia.', error: err.message });
    }
});

router.delete('/:id', tokenVerification, async (req, res) => {
    try {
        const listing = await Listing.findOneAndDelete({ _id: req.params.id, teacher: req.user._id });
        if (!listing) {
            return res.status(404).json({ message: 'Ogłoszenie nie zostało znalezione.' });
        }
        res.json({ message: 'Ogłoszenie zostało usunięte.' });
    } catch (err) {
        res.status(500).json({ message: 'Błąd serwera' });
    }
});

// Trasy do recenzji
router.post('/:id/reviews', tokenVerification, addReview);
router.put('/:id/reviews/:reviewId', tokenVerification, editReview);
router.delete('/:id/reviews/:reviewId', tokenVerification, deleteReview);

router.post("/:listingId/promote", tokenVerification, promoteListing);


module.exports = router;