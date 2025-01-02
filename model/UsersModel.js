const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        
    },
    name: {
        type: String,
        
    },
    avatar: {
        type: String,
        default:
          "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
      },


})

const UserModel = mongoose.model("Users", usersSchema);

module.exports = { UserModel };