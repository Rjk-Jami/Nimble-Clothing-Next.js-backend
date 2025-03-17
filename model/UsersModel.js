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
    phone: {
        type: String,
        
    },
    avatar: {
        type: String,
        default:
          "https://res.cloudinary.com/dpphpbkkz/image/upload/v1738778641/user_15817476_ptdoso.png",
      },


})

const UserModel = mongoose.model("UsersTest", usersSchema);

module.exports = { UserModel };