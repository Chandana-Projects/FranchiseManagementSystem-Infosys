const { z } = require("zod");

exports.createOutletSchema = z.object({
  body: z.object({
    outlet_name: z.string().min(1, "Outlet name is required"),
    franchise_name: z.string().optional(),
    manager_id: z.number().int().positive("Manager ID must be valid").optional().or(z.string().regex(/^\d+$/).transform(val => Number(val))),
    city: z.string().min(1, "City is required"),
    state: z.string().optional(),
    address: z.string().optional(),
    latitude: z.number().optional().or(z.string().transform(val => Number(val))),
    longitude: z.number().optional().or(z.string().transform(val => Number(val))),
    opening_date: z.string().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    status: z.string().optional(),
  }),
});
