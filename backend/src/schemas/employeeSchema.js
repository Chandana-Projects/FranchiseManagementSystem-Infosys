const { z } = require('zod');

exports.createEmployeeSchema = z.object({
  body: z.object({
    full_name: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    role: z.string().min(1, 'Role is required'),
    salary: z.number().positive('Salary must be positive').optional(),
    outlet_id: z.number().int().positive('Outlet ID must be valid'),
    status: z.string().optional(),
    joining_date: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  }),
});
