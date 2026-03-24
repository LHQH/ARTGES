import { Prisma } from "../../generated/prisma/client.js"
import bcrypt from "bcrypt"

export const hashPasswordExtension = Prisma.defineExtension({
    name: "hashPassword",
    query: {
        craftman: {
            async create({ args, query }) {
                if (args.data.password) {
                    args.data.password = await bcrypt.hash(args.data.password, 10)
                }
                return query(args)
            },

            async update({ args, query }) {
                if (args.data.password) {
                    args.data.password = await bcrypt.hash(args.data.password, 10)
                }
                return query(args)
            }
        }

    
    }
})