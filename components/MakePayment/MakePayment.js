const { ProductsModal } = require("../../model/ProductsModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const YOUR_DOMAIN = process.env.FRONTEND_URL || "http://localhost:3000";
const bdtToUsd = 0.0082;

const MakePayment = async (req, res) => {
  try {
    const { totalPayment } = req.body;
    console.log(totalPayment, "productsTotalForPayment");
const amount = Math.floor(totalPayment * bdtToUsd * 100)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });
    console.log(paymentIntent.client_secret, "paymentIntent")
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the payment" });
  }
};

module.exports = { MakePayment };
