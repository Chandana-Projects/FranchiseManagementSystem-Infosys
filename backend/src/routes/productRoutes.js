const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const validateRequest = require('../middlewares/validateRequest');
const { createProductSchema, updateProductSchema } = require('../schemas/productSchema');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Returns a list of products
 *     responses:
 *       200:
 *         description: A list of products
 *   post:
 *     summary: Creates a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_name:
 *                 type: string
 *               sku:
 *                 type: string
 *               unit_price:
 *                 type: number
 *     responses:
 *       201:
 *         description: The created product
 */
router.get('/', productController.getAllProducts);
router.post('/', validateRequest(createProductSchema), productController.createProduct);
router.put('/:id', validateRequest(updateProductSchema), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
