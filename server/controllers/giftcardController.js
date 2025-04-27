const Giftcard = require("../models/giftcards");
const {User} = require("../models/user");
exports.getCodeByName = async (req, res) => {
    try {
      const { code} = req.query;


      const user = await User.findById(req.user._id);

      if(!user){
      return res.status(400).json({ message: "Nie znaleziono użytkownika!" });
        }
      const existingCode = await Giftcard.findOne({ code });
      const existingUser = await Giftcard.findOne({usedBy: user._id});

        if(existingUser){
        return res.status(400).json({message: "Wykorzystałeś już kod podarunkowy!"});
        }

      if (!existingCode) {
        return res.status(400).json({ message: "Ten kod jest niepoprawny!" });
      }
  
      if (existingCode.used) {
        return res.status(400).json({ message: "Ten kod został już wykorzystany!" });
      }

      if(existingCode.usedBy === user._id){
        return res.status(400).json({message: "Wykorzystałeś już ten kod podarunkowy!"});
      }
    
      if (new Date(existingCode.expiresAt) < new Date()) {
          return res.status(400).send({ message: 'Ten kod wygasł!' });
      }
    




      existingCode.used = true;

      existingCode.usedBy = user._id;

      user.balance += parseFloat(existingCode.balance);



      await existingCode.save();
      await user.save();

        
      res.json(existingCode);
    } catch (error) {
      console.error("Błąd podczas pobierania kodów.", error);
      res.status(500).json({ message: "Błąd serwera" });
    }
  };
  
