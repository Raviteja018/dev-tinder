const mongoose = require('mongoose');

const connectDB = async() => {
    return await mongoose.connect('mongodb+srv://rt3605257:qXDW2akLkYSTCCjb@devtinder.z0u2ugj.mongodb.net/devTinder')
}


module.exports = connectDB



