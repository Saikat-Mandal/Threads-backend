import { prismaClient } from "../lib/db"
import { createHmac, randomBytes } from "node:crypto"
import JWT from "jsonwebtoken"
export interface CreateUserPayload {
    firstname: string,
    lastname?: string,
    email: string,
    password: string

}

export interface getUserTokenPayload {
    email: string,
    password: string
}
//controllers
class UserService {

    // hash a password
    public static generateHash(salt: string, password: string) {
        const hashedPassword = createHmac('sha256', salt).update(password).digest("hex")
        return hashedPassword
    }

    // signup 
    public static createUser(payload: CreateUserPayload) {
        const { firstname, lastname, email, password } = payload
        const salt = randomBytes(32).toString('hex')
        const hashedPassword = UserService.generateHash(salt, password)
        return prismaClient.user.create({
            data: {
                firstname,
                lastname,
                email,
                salt,
                password: hashedPassword
            }
        })
    }

    private static getUserByEmail(email: string) {
        return prismaClient.user.findUnique({ where: { email } })
    }
    // login 
    public static async getUserToken(payload: getUserTokenPayload) {
        const { email, password } = payload
        const user = await UserService.getUserByEmail(email)
        if (!user) {
            throw new Error("User not found")
        }

        const userSalt = user.salt
        const userHashPassword = UserService.generateHash(userSalt, password)

        if (user.password !== userHashPassword) {
            throw new Error("Password wrong!")
        }

        // gen token 
        const token = JWT.sign({ id: user.id, email: user.email }, "mylittlesecret")
        return token
    }
}

export default UserService