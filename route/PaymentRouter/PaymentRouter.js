const express = require('express');
const { MakePayment } = require('../../components/MakePayment/MakePayment');
const router = express.Router();

router.post("/create-payment-intent", MakePayment)


module.exports = router;