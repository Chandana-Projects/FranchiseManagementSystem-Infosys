const fs = require('fs');
const path = require('path');
const prisma = require('../config/prisma');

const datasetPath = path.join(__dirname, '../../../dataset/employees.json');

exports.getAllEmployees = async (req, res, next) => {
  try {
    const userRole = (req.user?.role || "manager").toLowerCase();
    const filter = (userRole !== "admin" && userRole !== "owner" && req.user?.outlet_id) 
      ? { where: { outlet_id: Number(req.user.outlet_id) } } 
      : {};

    const employees = await prisma.employees.findMany({
      ...filter,
      include: {
        outlets: true
      }
    });

    let dataset = [];
    try {
      dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
      if (userRole !== "admin" && userRole !== "owner" && req.user?.outlet_id) {
        dataset = dataset.filter(emp => emp.outlet_id === Number(req.user.outlet_id));
      }
    } catch (_) {}

    if (employees.length > 0) return res.json(employees);
    res.json(dataset);
  } catch (error) {
    try {
      const userRole = (req.user?.role || "manager").toLowerCase();
      let dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
      if (userRole !== "admin" && userRole !== "owner" && req.user?.outlet_id) {
        dataset = dataset.filter(emp => emp.outlet_id === Number(req.user.outlet_id));
      }
      res.json(dataset);
    } catch (_) {
      next(error);
    }
  }
};

const { broadcast } = require("../services/sseService");

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
    
    // Broadcast real-time change
    broadcast("EMPLOYEE_UPDATE", newEmployee);

    res.status(201).json(newEmployee);
  } catch (error) {
    next(error);
  }
};

