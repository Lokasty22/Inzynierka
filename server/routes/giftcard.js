const express = require("express");
const router = express.Router();
const Giftcard = require("../models/giftcards");
const giftcardController = require ("../controllers/giftcardController");
const tokenVerification = require("../middleware/tokenVerification");

const generateGiftcardCode = () => { 
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = ""
    for(let i = 0 ; i < 4 ; i ++ ){
        for(let j = 0 ; j < 4 ; j ++ ){
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        if( i !== 3){
            result += "-";
        }
    }
    return result;
};

router.post('/wygeneruj-giftcard', async(req, res) => { 
try{
    let generatedCode;
    let exists = true;
    while(exists){
        generatedCode = generateGiftcardCode();
        const existingGiftcard = await Giftcard.findOne({code: generatedCode});
        if(!existingGiftcard){
            exists = false;
        }
    }

    const newGiftCard = new Giftcard({...req.body, code: generatedCode});
    await newGiftCard.save();
    res.status(201).json(newGiftCard);
} catch(error){
    console.error("Błąd podczas generowania giftcardów.", error);
    res.status(500).send({message: "Błąd serwera"});
}
}
);

router.get('/', tokenVerification, giftcardController.getCodeByName);

module.exports = router;