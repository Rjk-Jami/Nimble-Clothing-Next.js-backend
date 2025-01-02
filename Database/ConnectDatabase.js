const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.SERVER_Database);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
};

module.exports = connectDatabase;