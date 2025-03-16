const healthCheck = async (req,res)=>{
    return res.status(200).send({success: true, message: "Health check successful"});
}
module.exports = {healthCheck}