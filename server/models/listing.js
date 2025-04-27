const mongoose = require('mongoose');
const Joi = require('joi');

const reviewSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
});

const availabilitySchema = new mongoose.Schema(
    {
        day: { type: String, required: true },
        times: [{ type: String, required: true }],
    },
    { _id: false }
);

const listingSchema = new mongoose.Schema({
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    mode: {
        type: String,
        enum: ["Online", "Stacjonarnie", "Stacjonarnie i Online"],
        required: true,
    },
    address: { type: String },
    state: { type: String, required: true },
    city: { type: String, required: true },
    availability: [availabilitySchema],
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: [reviewSchema],
    createdAt: { type: Date, default: Date.now },
    teachingScope: { type: String },
    experience: { type: String },
    education: { type: String },

    isPromoted: { type: Boolean, default: false }, 
    promotionEndDate: { type: Date, default: null}, 
});


function validateListing(listing) {
    const availabilitySchemaJoi = Joi.array()
        .items(
            Joi.object({
                day: Joi.string()
                    .valid('Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela')
                    .required(),
                times: Joi.array()
                    .items(Joi.string().pattern(/^([0-9]|[0-1][0-9]|2[0-3]):[0-5][0-9]$/))
                    .required(),
            })
        )
        .min(0);

    const schema = Joi.object({
        subject: Joi.string().min(2).max(100).required(),
        title: Joi.string().min(5).max(200).required(),
        description: Joi.string().min(10).required(),
        pricePerHour: Joi.number().min(0).required(),
        mode: Joi.string().valid("Online", "Stacjonarnie", "Stacjonarnie i Online").required(),
        address: Joi.string().max(50).allow(''),
        state: Joi.string().min(2).max(100).required(),
        city: Joi.string().min(2).max(100).required(),
        availability: availabilitySchemaJoi,
        teachingScope: Joi.string().max(500).allow(''),
        experience: Joi.string().max(1000).allow(''),
        education: Joi.string().max(1000).allow(''),

        isPromoted: Joi.boolean().optional(),
        promotionEndDate: Joi.date().optional(),
    });

    return schema.validate(listing);
}

function validateReview(review) {
    const schema = Joi.object({
        comment: Joi.string().min(10).required(),
        rating: Joi.number().min(1).max(5).required(),
    });
    return schema.validate(review);
}

const Listing = mongoose.model('Listing', listingSchema);

module.exports = { Listing, validateListing, validateReview };
