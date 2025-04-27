const { User, validate } = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require('path');
const AdminMessage = require("../models/adminMessage");


// Rejestracja użytkownika
exports.registerUser = async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).send("Użytkownik z tym adresem email już istnieje.");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({ ...req.body, password: hashedPassword });
    await user.save();

    const token = user.generateAuthToken();
    res.status(201).send({ token, user });
};

// Logowanie użytkownika
exports.loginUser = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Niepoprawny email lub hasło.");

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) return res.status(400).send("Niepoprawny email lub hasło.");

    const token = user.generateAuthToken();
    res.send({ token, user });
};


// Pobranie informacji na profil
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).send('Użytkownik nie znaleziony');
        res.send(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Błąd serwera');
    }
};

exports.getUserProfileById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).send('Użytkownik nie znaleziony');
        res.send(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Błąd serwera');
    }
};

// Akrualizacja profilu
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const updatedData = req.body;

        if (req.file) {
            updatedData.profilePicture = req.file.filename;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
        if (!updatedUser) return res.status(404).send('Użytkownik nie znaleziony');
        res.send(updatedUser);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).send('Błąd serwera');
    }
};

// Zmiana hasła
exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).send('Użytkownik nie znaleziony');

        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) return res.status(400).send({ message: 'Nieprawidłowe aktualne hasło' });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.send({ message: 'Hasło zostało zmienione' });
    } catch (error) {
        res.status(500).send('Błąd serwera');
    }
};

// Usunięcie użytkownika
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).send('Użytkownik nie znaleziony');
        res.send({ message: 'Konto zostało usunięte' });
    } catch (error) {
        res.status(500).send('Błąd serwera');
    }
};

// Pobranie wiadomości dla konkretnego użytkownika
exports.getMessageById = async (req, res) => {
    try{
        const message = await AdminMessage.findById(req.params.id);
        if(!message) return res.status(404).send('Wiadomość nie znaleziona');
        res.send(message);
    } catch (error){
        console.error('Error fetching message:', error);
        res.status(500).send('Błąd serwera');
    }
}

//Przesłanie pieniędzy korepetytorowi
exports.updateTeacherBalance = async (teacherId, lessonCost) => {
    try {
        const user = await User.findById(teacherId);
        if (!user) {
            throw new Error('Użytkownik nie został znaleziony.');
        }
        user.balance += lessonCost; 
        await user.save();
        return user;
    } catch (error) {
        console.error('Błąd aktualizacji salda użytkownika:', error.message);
        throw error;
    }
};

//pobranie pieniędzy za lekcje
exports.updateUserBalance = async (userId, lessonCost) => {
    try {
        const user = await User.findById(userId);
        if (user.balance < lessonCost) {
            throw new Error('Niewystarczające saldo.');
        }
        user.balance -= lessonCost;
        await user.save();
    } catch (error) {
        throw error;
    }
};

// zwrot pieniędzy
exports.refundUserBalance = async (userId, lessonCost) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Użytkownik nie znaleziony.');
        }

        // Konwersja na liczby
        const currentBalance = parseFloat(user.balance) || 0;
        const cost = parseFloat(lessonCost);
        console.log('cost:', cost);
        if (isNaN(cost)) {
            throw new Error('Niepoprawna wartość lessonCost.');
        }

        user.balance = currentBalance + cost; // Zwracamy środki do salda użytkownika
        await user.save();
    } catch (error) {
        throw error;
    }
};


