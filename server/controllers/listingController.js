const { Listing, validateListing, validateReview } = require('../models/listing');
const { User } = require('../models/user'); 


exports.addListing = async (req, res) => {
    const { error } = validateListing(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    const {
        subject,
        title,
        description,
        pricePerHour,
        mode,
        address,
        state,
        city,
        availability,
        teachingScope,
        experience,
        education,
        isPromoted,
        promotionEndDat,
    } = req.body;

    try {
        const newListing = new Listing({
            teacher: req.user._id,
            subject,
            title,
            description,
            pricePerHour,
            mode,
            address,
            state,
            city,
            availability,
            teachingScope,
            experience,
            education,
            isPromoted,
            promotionEndDat,
        });

        const savedListing = await newListing.save();
        res.status(201).json(savedListing);
    } catch (err) {
        console.error('Error adding listing:', err);
        res.status(500).json({ error: 'Nie udało się dodać ogłoszenia', details: err.message });
    }
};

exports.getListings = async (req, res) => {
    try {
        const { subject, state, city } = req.query;

        const query = {};
        if (subject) query.subject = subject;
        if (state) query.state = state;
        if (city) query.city = city;

        const listings = await Listing.find(query)
            .populate('teacher', 'firstName lastName profilePicture state city')
            .exec();

        res.json(listings);
    } catch (error) {
        console.error('Błąd podczas pobierania ogłoszeń:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

exports.getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id)
            .populate('teacher', 'firstName lastName profilePicture')
            .populate('reviews.student', 'firstName lastName profilePicture state city')
            .exec();

        if (!listing) {
            return res.status(404).json({ message: 'Ogłoszenie nie znalezione' });
        }
        res.json(listing);
    } catch (error) {
        console.error('Błąd podczas pobierania ogłoszenia:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

exports.addReview = async (req, res) => {


    try {
        
        console.log("Odebrano żądanie dodania recenzji");
        const { error } = validateReview(req.body);
        if (error) {
            console.log("Błąd walidacji:", error.details[0].message);
            return res.status(400).send({ message: error.details[0].message });
        }

        const listingId = req.params.id;
        console.log("ID ogłoszenia:", listingId);

        const listing = await Listing.findById(listingId);
        if (!listing) {
            console.log("Nie znaleziono ogłoszenia");
            return res.status(404).send({ message: 'Ogłoszenie nie znalezione' });
        }

        console.log("Znaleziono ogłoszenie:", listing.title);
        console.log("Dostępność przed dodaniem recenzji:", listing.availability);

        const existingReview = listing.reviews.find(review => review.student.toString() === req.user._id);
        if (existingReview) {
            console.log("Użytkownik już ma recenzję");
            return res.status(400).send({ message: 'Już dodałeś recenzję do tego ogłoszenia' });
        }

        const newReview = {
            student: req.user._id,
            comment: req.body.comment,
            rating: req.body.rating
        };

        listing.reviews.push(newReview);
        // Aktualizacja średniej oceny
        listing.rating = listing.reviews.reduce((acc, curr) => acc + curr.rating, 0) / listing.reviews.length;

        console.log("Dostępność przed zapisaniem:", listing.availability);
        await listing.save();
        console.log("Recenzja dodana pomyślnie");
        res.status(201).send({ message: 'Recenzja dodana', review: newReview });
    } catch (error) {
        console.error("Błąd podczas dodawania recenzji:", error);
        res.status(500).send({ message: 'Błąd serwera' });
    }
};

// Edycja recenzji
exports.editReview = async (req, res) => {
    try {
        const { error } = validateReview(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        const listing = await Listing.findById(req.params.id);
        if (!listing) return res.status(404).send({ message: 'Ogłoszenie nie znalezione' });

        const review = listing.reviews.id(req.params.reviewId);
        if (!review) return res.status(404).send({ message: 'Recenzja nie znaleziona' });

        if (review.student.toString() !== req.user._id)
            return res.status(403).send({ message: 'Nie masz uprawnień do edycji tej recenzji' });

        review.comment = req.body.comment;
        review.rating = req.body.rating;
        review.updatedAt = Date.now();

        // Aktualizacja średniej oceny
        listing.rating = listing.reviews.reduce((acc, curr) => acc + curr.rating, 0) / listing.reviews.length;

        await listing.save();
        res.send({ message: 'Recenzja zaktualizowana', review });
    } catch (error) {
        console.error("Błąd podczas edycji recenzji:", error);
        res.status(500).send({ message: 'Błąd serwera' });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        console.log("Odebrano żądanie usunięcia recenzji");
        const listingId = req.params.id;
        const reviewId = req.params.reviewId;
        console.log("ID ogłoszenia:", listingId);
        console.log("ID recenzji:", reviewId);

        const listing = await Listing.findById(listingId);
        if (!listing) {
            console.log("Nie znaleziono ogłoszenia");
            return res.status(404).send({ message: 'Ogłoszenie nie znalezione' });
        }

        console.log("Znaleziono ogłoszenie:", listing.title);
        console.log("Dostępność przed usunięciem recenzji:", listing.availability);

        const review = listing.reviews.id(reviewId);
        if (!review) {
            console.log("Nie znaleziono recenzji");
            return res.status(404).send({ message: 'Recenzja nie znaleziona' });
        }

        if (review.student.toString() !== req.user._id) {
            console.log("Użytkownik nie ma uprawnień do usunięcia tej recenzji");
            return res.status(403).send({ message: 'Nie masz uprawnień do usunięcia tej recenzji' });
        }

        listing.reviews.pull(reviewId);

        // Aktualizacja średniej oceny
        if (listing.reviews.length > 0) {
            listing.rating = listing.reviews.reduce((acc, curr) => acc + curr.rating, 0) / listing.reviews.length;
        } else {
            listing.rating = 0;
        }

        console.log("Dostępność przed zapisaniem:", listing.availability);
        await listing.save();
        console.log("Recenzja usunięta pomyślnie");
        res.send({ message: 'Recenzja usunięta' });
    } catch (error) {
        console.error("Błąd podczas usuwania recenzji:", error);
        res.status(500).send({ message: 'Błąd serwera' });
    }
};

exports.promoteListing = async (req, res) => {
    const { listingId } = req.params;
    console.log("Listing ID:", listingId); 
    const { days, price, userId } = req.body; 
    
    if (!days || !price) {
      return res.status(400).json({ message: "Brak wymaganych danych (days lub price)." });
    }
  
    try {
      const listing = await Listing.findById(listingId);
        
      if (!listing) {
        return res.status(404).json({ message: "Ogłoszenie nie zostało znalezione." });
      }
      

      const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Użytkownik nie został znaleziony." });
        }
        if (user.balance < price) {
            return res.status(400).json({ message: "Niewystarczające saldo, aby opłacić promocję." });
        }

        user.balance -= price;
        await user.save();
     
      const promotionEndDate = new Date();
      promotionEndDate.setDate(promotionEndDate.getDate() + days);
  
      listing.isPromoted = true;
      listing.promotionEndDate = promotionEndDate;
  
      await listing.save();

      
  
      res.status(200).json({ message: "Ogłoszenie zostało pomyślnie promowane." });
    } catch (error) {
      console.error("Błąd podczas promowania ogłoszenia:", error);
      res.status(500).json({ message: "Wystąpił błąd podczas promowania ogłoszenia." });
    }
  }
