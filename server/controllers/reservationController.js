const Reservation = require('../models/reservation');
const jwt = require('jsonwebtoken');
const { updateUserBalance, refundUserBalance, updateTeacherBalance } = require('../controllers/userController'); 

exports.createReservation = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, comment, lessonType, selectedDate, selectedTime,status, listingId, userId, lessonCost } = req.body;

        
        const newReservation = new Reservation({
            firstName,
            lastName,
            email,
            phone,
            comment,
            lessonType,
            selectedDate,
            selectedTime,
            status,
            listingId,
            userId,
            lessonCost,
        });

        

        const savedReservation = await newReservation.save();
        try{
        await updateUserBalance(userId, lessonCost);
        }
        catch{
            return res.status(500).json({ error: 'Brak środków.' });

        }
        res.status(201).json(savedReservation);
    } catch (error) {
     
        return res.status(500).json({ error: 'Błąd przy tworzeniu rezerwacji' });
    }
};

exports.getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().populate('listingId');
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ error: 'Błąd przy pobieraniu rezerwacji' });
    }
};

//rezerwacje dla danego użytkownika
exports.getUserReservations = async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).json({ error: 'Brak tokenu autoryzacyjnego' });
        }

        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        const userId = decoded._id;

        const reservations = await Reservation.find({ userId }).populate({path: 'listingId',
            populate: { path: 'teacher', select: 'firstName lastName profilePicture city state' },
    });
        if (!reservations || reservations.length === 0) {
            return res.status(404).json({ error: 'Brak rezerwacji' });
        }

        res.status(200).json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd podczas pobierania rezerwacji' });
    }
};

//rezerwacje dla danego ogłoszenia
exports.getReservationsByListing = async (req, res) => {
    try {
        const { listingId } = req.params; 

        
        const reservations = await Reservation.find({ listingId })
            .populate('listingId', 'title location'); 

        if (!reservations) {
            return res.status(404).json({ error: 'Brak rezerwacji dla tego ogłoszenia' });
        }

        res.status(200).json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd podczas pobierania rezerwacji' });
    }
};



exports.updateReservationStatus = async (req, res) => {
    try {
        const { reservationId } = req.params;
        const { status } = req.body;
        const { userId } = req.body;
        const { lessonCost } = req.body;

        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ message: 'Rezerwacja nie została znaleziona.' });
        }
        if(status == 'Anulowane')
        {
            try
            {
                await refundUserBalance(userId, lessonCost);
            }catch(error)
            {        
                console.error(error);
            }
        }
        if(status == 'Potwierdzone')
            {
                try{
                    const token = req.header('x-auth-token');
                    if (!token) {
                        return res.status(401).json({ error: 'Brak tokenu autoryzacyjnego' });
                    }

                    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
                    const teacherId = decoded._id;
                    await updateTeacherBalance(teacherId, lessonCost);
                   
                }catch(error)
                {
                    console.error(error);
                }
            }
        reservation.status = status;
        await reservation.save();
        res.status(200).json({ message: 'Status rezerwacji został zaktualizowany.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Wystąpił błąd przy aktualizacji statusu.' });
    }
};
