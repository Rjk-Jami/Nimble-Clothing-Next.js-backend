const { ProductsModal } = require("../../model/ProductsModel");
const { PaymentModel } = require("../../model/PurchaseModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const YOUR_DOMAIN = process.env.FRONTEND_URL || "http://localhost:3000";
const bdtToUsd = 0.0082;

const MakePayment = async (req, res) => {
  try {
    const { totalPayment } = req.body;
    console.log(totalPayment, "productsTotalForPayment");
    const amount = Math.floor(totalPayment * bdtToUsd * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });
    console.log(paymentIntent.client_secret, "paymentIntent");
    res
      .status(200)
      .json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the payment" });
  }
};

const Purchase = async (req, res) => {
  try {
    // Extract payment details from the request body
    const { paymentDetails } = req.body;

    // Log for debugging
    console.log("Payment Details Received:", paymentDetails);

    if (
      !paymentDetails ||
      !paymentDetails.name ||
      !paymentDetails.email ||
      !paymentDetails.product?.length
    ) {
      return res.status(400).send({
        success: false,
        message: "Invalid payment details. Please check your input.",
      });
    }

    const payment = await PaymentModel.create(paymentDetails);

    return res.status(200).send({
      success: true,
      message: "Purchase confirmed!",
      paymentId: payment._id,
    });
  } catch (error) {
    console.error("Error during purchase:", error);

    return res.status(500).send({
      success: false,
      message: "Please try again.",
    });
  }
};

module.exports = { MakePayment, Purchase };
