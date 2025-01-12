const { ProductsModal } = require('../../model/ProductsModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const YOUR_DOMAIN = process.env.FRONTEND_URL || "http://localhost:3000";
const bdtToUsd = 0.0082;
const MakePayment = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No items provided." });
    }

    // Fetch products from database
    const productIds = items.map((item) => item.productId);
    const products = await ProductsModal.find({ _id: { $in: productIds } }, "name description price stripeProductId stripePriceId");

    if (products.length !== items.length) {
      const foundIds = products.map((p) => p._id.toString());
      const missingIds = productIds.filter((id) => !foundIds.includes(id));
      return res.status(404).json({ error: "Some products not found.", missingIds });
    }

    const lineItems = await Promise.all(
      items.map(async ({ productId, quantity }) => {
        const product = products.find((p) => p._id.toString() === productId);

        if (!product) {
          throw new Error(`Product with ID ${productId} not found.`);
        }

        let stripeProductId = product.stripeProductId;
        let stripePriceId = product.stripePriceId;

        // Create Stripe Product if not exists
        if (!stripeProductId) {
          const stripeProduct = await stripe.products.create({
            name: product.name,
            description: product.description,
          });
          stripeProductId = stripeProduct.id;
          product.stripeProductId = stripeProductId;
        }
        const priceInUsd = product.current_price * bdtToUsd;
        // Create Stripe Price if not exists
        if (!stripePriceId) {
          const price = await stripe.prices.create({
            unit_amount:priceInUsd * 100, // Ensure product.price is in cents
            currency: "usd",
            product: stripeProductId,
          });
          stripePriceId = price.id;
          product.stripePriceId = stripePriceId;
        }

        // Save updated product to the database
        await product.save();

        return { price: stripePriceId, quantity };
      })
    );

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

module.exports = { MakePayment };
