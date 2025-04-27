const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');

exports.loginUser = async (req, res) => {
    try {
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(401).send({ message: 'Niepoprawny email lub hasło!' });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(401).send({ message: 'Niepoprawny email lub hasło!' });

        const token = user.generateAuthToken();
        res.status(200).send({ data: token, message: 'Logowanie udane' });
    } catch (error) {
        res.status(500).send({ message: 'Błąd serwera' });
    }
};

const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label('Email'),
        password: Joi.string().required().label('Password'),
    });
    return schema.validate(data);
};
