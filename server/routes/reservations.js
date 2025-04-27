const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.post('/', reservationController.createReservation);

router.get('/', reservationController.getReservations);

router.get('/user', reservationController.getUserReservations);


router.get('/:listingId', reservationController.getReservationsByListing);


router.patch('/:reservationId', reservationController.updateReservationStatus);


module.exports = router;
