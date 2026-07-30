const fs = require('fs');
const path = require('path');
const prisma = require('../config/prisma');

const datasetPath = path.join(__dirname, '../../../dataset/products.json');

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await prisma.products.findMany();
    if (products.length > 0) return res.json(products);
    
    // Fallback to real dataset file
    const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
    res.json(dataset);
  } catch (error) {
    try {
      const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
      res.json(dataset);
    } catch (_) {
      next(error);
    }
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { product_name, sku, category, unit_price, description } = req.body;
    const newProduct = await prisma.products.create({
      data: {
        product_name,
        sku,
        category,
        unit_price,
        description
      }
    });
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { product_name, sku, category, unit_price, description } = req.body;
    const updatedProduct = await prisma.products.update({
      where: { product_id: Number(id) },
      data: {
        product_name,
        sku,
        category,
        unit_price,
        description
      }
    });
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.products.delete({
      where: { product_id: Number(id) }
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

