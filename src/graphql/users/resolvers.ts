import UserService, { CreateUserPayload, getUserTokenPayload } from "../../services/user"

const queries = {
    getUserToken: async (_: any, payload: getUserTokenPayload) => {
        const { email, password } = payload
        const token = await UserService.getUserToken({
            email: email,
            password: password
        })

        return token
    }
}
const mutations = {
    createUser: async (_: any, payload: CreateUserPayload) => {
        const res = await UserService.createUser(payload)
        return res.id
    }
}

export const resolvers = { queries, mutations }