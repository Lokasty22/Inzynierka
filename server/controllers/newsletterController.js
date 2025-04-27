const {Newsletter, validateNewsletter,} = require("../models/newsletter");
exports.newsletterSubscribe = async (req, res) => {
  try {
    const {error} = validateNewsletter(req.body);

    if(error){
        return res.status(400).json({message: "Adres email jest niepoprawny!"});
    }

    const { subscribtionEmail } = req.body;
    const existingSubscribtion = await Newsletter.findOne({
      email: subscribtionEmail,
    });
    if (existingSubscribtion) {
      return res.status(400).json({ message: "Ten adres jest już zajęty!" });
    }
    const newSubscribtion = new Newsletter({
      email: subscribtionEmail,
    });
    await newSubscribtion.save();
    res.status(201).send({ message: "Pomyślnie zasubskrybowano." });
  } catch (error) {
    console.error("Błąd podczas subskrybowania. ", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

exports.getAllNewsletters = async (req, res) => {
  try {

    const newsletters = await Newsletter.find();

    if(!newsletters && newsletters.length <= 0 ){
      return res.status(404).json({message: 'Nie znaleziono żadnych subskrybcji'});
    }

    res.json(newsletters);
  } catch (error) {
    console.error("Błąd podczas pobierania newsletterów.");
    res.status(500).json({ message: "Błąd serwera" });
  }
};
