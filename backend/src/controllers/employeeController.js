const fs = require('fs');
const path = require('path');
const prisma = require('../config/prisma');

const datasetPath = path.join(__dirname, '../../../dataset/employees.json');

exports.getAllEmployees = async (req, res, next) => {
  try {
    const employees = await prisma.employees.findMany({
      include: {
        outlets: true
      }
    });
    if (employees.length > 0) return res.json(employees);

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

exports.createEmployee = async (req, res, next) => {
  try {
    const { full_name, email, phone, role, salary, outlet_id, status, joining_date } = req.body;
    const newEmployee = await prisma.employees.create({
      data: {
        full_name,
        email,
        phone,
        role,
        salary,
        outlet_id: Number(outlet_id),
        status,
        joining_date: joining_date ? new Date(joining_date) : undefined
      }
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    next(error);
  }
};

