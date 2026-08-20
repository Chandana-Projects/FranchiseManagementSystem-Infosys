const { z } = require('zod');

exports.registerSchema = z.object({
  body: z.object({
    full_name: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(4, 'Password must be at least 4 characters'),
    role: z.enum(['admin', 'manager', 'owner', 'staff']).optional(),
    outlet_id: z.number().int().positive().optional().nullable(),
  }),
});

exports.loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});
