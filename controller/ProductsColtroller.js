const { ProductsModal } = require("../model/ProductsModel");

const inventoryHealthCheck = async (req, res, next) => {
  res.status(200).send({ success: true, message: "your inventory is healthy" });
};
const uploadProduct = async (req, res, next) => {
  try {
    let data = req.body;
    // console.log(data);
    const product = await ProductsModal.create(data);
    res.status(200).send({ success: true, product });
  } catch (error) {
    next(error);
  }
};
const viewAllProduct = async (req, res, next) => {
  try {
    const allProduct = await ProductsModal.find();
    // const allProduct =  []
    // console.log(allProduct)
    console.log(allProduct.length);
    if (allProduct.length === 0) {
      return res
        .status(404)
        .send({ success: false, message: "No Product found" });
    }
    res.status(200).send({ success: true, allProduct });
  } catch (error) {
    next(error);
  }
};
const viewProductById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await ProductsModal.findOne({ _id: id });
    // console.log(product)
    if (!product) {
      return res
        .status(404)
        .send({ success: false, message: "Product not found" });
    }
    res.status(200).send({ success: true, product });
  } catch (error) {
    next(error);
  }
};
 
module.exports = { uploadProduct, viewAllProduct, viewProductById , inventoryHealthCheck };
