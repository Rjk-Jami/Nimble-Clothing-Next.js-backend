const { ProductsModal } = require("../model/ProductsModel");
const { PaymentModel } = require("../model/PurchaseModel");
const getSingleOrderedProducts = async (req, res) =>{
  try {
    const id = req.params.id;
    const order = await PaymentModel.findOne({_id: id})
    console.log(order, "getSingleOrderedProducts")
    res.status(200).send({success: true, order});
} catch (error) {
     next(error);
}
}

const getOrderedProductsDetails = async (req, res) => {
  try {
    const validUser = req.user;
    // console.log(validUser, "user validUser from getOrderedProductsDetails");
    const { _id } = req.body;
    if (!validUser._id === _id) {
      return res
        .status(400)
        .send({ success: false, message: "Unauthorized Access" });
    }
    // console.log(_id, "user id from getOrderedProductsDetails");

    const totalOrder = await PaymentModel.find({ email: validUser.email });

    if (totalOrder.length === 0) {
      return res.status(200).send({
        orderedProduct: false,
        message: "No order has been made yet.",
      });
    }
    // console.log(totalOrder, "totalOrder")

    const totalPayable = totalOrder.filter((order) => order.isPayed === false);
    //  console.log(totalPayable.length, "totalPayable");
    const totalPayableProducts = totalPayable.length;

    return res.status(200).send({
      success: true,
      totalOrder,
      totalPayableProducts,
      message: "Orders retrieved successfully",
    });
  } catch (error) {
    console.error("Error in getOrderedProductsDetails:", error);
    res.status(500).send({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

const getOrderedProducts = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, error: "Invalid or empty 'ids' array." });
  }

  console.log(ids, "getOrderedProducts");

  try {
    const products = await ProductsModal.find({ _id: { $in: ids } })
      .select("name image current_price")
      .exec();

    console.log(products, "products");

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found." });
    }

    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "An error occurred while fetching products." });
  }
};

module.exports = { getOrderedProductsDetails, getOrderedProducts, getSingleOrderedProducts };
