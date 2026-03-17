import { PrismaMariaDb } from '@prisma/adapter-mariadb'
export const adapter = new PrismaMariaDb(
  {
    connectionLimit: 5,
    port: process.env.DB_PORT, //3306
    database: process.env.DB_NAME, // demo_psi_monobloc
    host: process.env.DB_HOST, // localhost
    password: process.env.DB_PASSWORD, // root ou vide
    user: process.env.DB_USER, // root
  },
  { schema: process.env.DB_NAME }
)