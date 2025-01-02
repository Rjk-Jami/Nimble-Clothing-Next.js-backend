const { ProductsModal } = require("../model/ProductsModel");

const uploadProduct = async (req, res, next) => {
    try {
        let data = req.body 
        // console.log(data);
        const product = await ProductsModal.create(data);
        res.status(200).send({success: true, product});
    } catch (error) {
         next(error);
    }
}
const viewAllProduct = async (req, res, next) => {
    try {
        const allProduct = await ProductsModal.find()
        // console.log(allProduct)
        res.status(200).send({success: true, allProduct});
    } catch (error) {
         next(error);
    }
}
const viewProductById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await ProductsModal.findOne({_id: id})
        // console.log(product)
        res.status(200).send({success: true, product});
    } catch (error) {
         next(error);
    }
}


module.exports = {uploadProduct,viewAllProduct, viewProductById}