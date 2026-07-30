const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await prisma.products.findMany();
    res.json(products);
  } catch (error) {
    next(error);
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

