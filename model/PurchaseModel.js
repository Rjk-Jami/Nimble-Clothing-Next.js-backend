const { default: mongoose } = require("mongoose")

const paymentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      streetAddress: {
        type: String,
        required: true,
      },
      orderNotes: {
        type: String,
        
      },
      zip: {
        type: String,
        
      },
      product: [
        {
          _id: { type: String, required: true },
          size: { type: String, required: true },
          quantity: { type: Number, required: true }
        }
      ],
      paymentMethod: {
        type: String,
        required: true,
      },

})

const PaymentModel = mongoose.model("Payment", paymentSchema)
module.exports = {PaymentModel}