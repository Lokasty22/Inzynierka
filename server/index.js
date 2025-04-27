const app = require('./app');
const mongoose = require('mongoose');

const port = process.env.PORT || 8080;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB, {});
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

if (require.main === module) {
    connectDB();
    app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`));
}

module.exports = app;
