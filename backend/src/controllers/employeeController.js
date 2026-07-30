const prisma = require('../config/prisma');

exports.getAllEmployees = async (req, res, next) => {
  try {
    const employees = await prisma.employees.findMany({
      include: {
        outlets: true
      }
    });
    res.json(employees);
  } catch (error) {
    next(error);
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

