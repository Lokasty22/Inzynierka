const { Listing } = require('../models/listing');

exports.getLatestReviews = async (req, res) => {
    try {
        const listingsWithReviews = await Listing.find({ 'reviews.0': { $exists: true } })
            .select('reviews title teacher')
            .populate('teacher', 'firstName lastName profilePicture')
            .populate('reviews.student', 'firstName lastName profilePicture')
            .lean(); 
        let allReviews = [];

        listingsWithReviews.forEach(listing => {
            const { _id: listingId, title: listingTitle, teacher, reviews } = listing;

            reviews.forEach(review => {
                allReviews.push({
                    reviewId: review._id,
                    comment: review.comment,
                    rating: review.rating,
                    createdAt: new Date(review.createdAt),
                    student: review.student,
                    teacher: teacher,
                    listingId: listingId,
                    listingTitle: listingTitle,
                });
            });
        });

        allReviews.sort((a, b) => b.createdAt - a.createdAt);

        const latestReviews = allReviews.slice(0, 10);

        res.status(200).json(latestReviews);
    } catch (error) {
        console.error('Błąd podczas pobierania recenzji:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
};