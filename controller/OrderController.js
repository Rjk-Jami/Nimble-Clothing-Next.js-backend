const { PaymentModel } = require("../model/PurchaseModel");

const getOrderedProducts = async (req, res) => {
try {
    const validUser = req.user;
    console.log(validUser, "user validUser from getOrderedProducts");
    const { _id } = req.body;
    if (!validUser._id === _id) {
      return res
        .status(400)
        .send({ success: false, message: "Unauthorized Access" });
    }
    console.log(_id, "user id from getOrderedProducts");
  
    const totalOrder = await PaymentModel.find({email:validUser.email})
    
    if(totalOrder.length === 0){
        return res.status(200).send({
            orderedProduct: false,
            message: "No order has been made yet.",
          });
    }
    console.log(totalOrder, "totalOrder")
  
    
     const totalPayable = totalOrder.filter(order => order.isPayed === false);
     console.log(totalPayable.length, "totalPayable");
     const totalPayableProducts = totalPayable.length;
  
    return res.status(200).send({success: true,totalOrder,totalPayableProducts, message: "Orders retrieved successfully",  })

} catch (error) {
    console.error("Error in getOrderedProducts:", error);
    return res.status(500).send({ success: false, message: "An error occurred", error: error.message });

}
}

module.exports = { getOrderedProducts };
