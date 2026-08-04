const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const validateRequest = require('../middlewares/validateRequest');
const { createEmployeeSchema } = require('../schemas/employeeSchema');

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Returns a list of employees
 *     responses:
 *       200:
 *         description: A list of employees
 *   post:
 *     summary: Creates a new employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               outlet_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: The created employee
 */
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, employeeController.getAllEmployees);
router.post('/', authenticateToken, requireRole(['admin', 'owner']), validateRequest(createEmployeeSchema), employeeController.createEmployee);

module.exports = router;
