const { PrismaClient } = require("@prisma/client");
<<<<<<< HEAD
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
=======

const prisma = new PrismaClient();
>>>>>>> 7770818c3ff2de3252d8663a972bcdafe1794c34

module.exports = prisma;