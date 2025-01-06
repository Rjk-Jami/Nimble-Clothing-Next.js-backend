const express = require('express');
const { uploadProduct, viewAllProduct, viewProductById } = require('../../controller/ProductsColtroller');
const { compareProducts } = require('../../components/CompareProducts/CompareProducts');

const router = express.Router();

// Define your routes here
// router.get('/', (req, res) => {
//     res.send('Get all products');
// });

router.post('/create', uploadProduct);
router.get('/', viewAllProduct);
router.get('/:id', viewProductById);
router.post('/compare/selectedProduct', compareProducts)
router.post('/wishList/selectedProduct', compareProducts)

// router.get('/:id', (req, res) => {
//     res.send(`Get product with ID ${req.params.id}`);
// });

// router.put('/:id', (req, res) => {
//     res.send(`Update product with ID ${req.params.id}`);
// });

// router.delete('/:id', (req, res) => {
//     res.send(`Delete product with ID ${req.params.id}`);
// });

module.exports = router;