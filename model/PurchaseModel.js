const { default: mongoose } = require("mongoose");

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
    default: "",
  },
  zip: {
    type: String,
    default: "",
  },
  product: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      size: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentData: {
    amount: { type: Number, },
    _id: {  type: String, },
  },
  
},
{ timestamps: true }
);

const PaymentModel = mongoose.model("Payment", paymentSchema);
module.exports = { PaymentModel };
