const { ProductsModal } = require("../../model/ProductsModel");

const compareProducts = async (req, res) => {

    try {
        const { productsId } = req.body; 
        console.log("Received productsId:", productsId);
        
       

        const products = await ProductsModal.find({_id: {$in : productsId} })
        console.log(products)
        return res.status(200).send({ success: true, products:products });
      } catch (error) {
        console.error('Error in compareProducts:', error); // Log the error for debugging
        return res.status(500).send({ success: false, error: 'An error occurred while comparing products.' });
      }
    }
    
    module.exports = { compareProducts };