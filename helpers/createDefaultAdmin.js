const crypto = require('crypto')
const randomString = () => crypto.randomBytes(6).hexSlice()

module.exports = (project) => async (keystone) => {
    // Count existing users
    const {
        data: {
            _allUsersMeta: { count },
        },
    } = await keystone.executeGraphQL({
        query: `query {
            _allUsersMeta {
                count
            }
        }`,
    })

    if (count === 0) {
        const context = keystone.createContext({ skipAccessControl: true })
        const projectAdminRole =
            project === 'mirrormedia'
                ? 'role: "moderator", isAdmin: true'
                : 'role: "admin"'
        const email = 'admin@mirrormedia.mg'
        const password = 'mirrormedia'
        // const password = (process.env.NODE_ENV === 'development') ? 'mirrormedia' : randomString();

        await keystone.executeGraphQL({
            mutation: `mutation initialUser($password: String, $email: String) {
                createUser(data: {name: "admin", email: $email, password: $password, ${projectAdminRole}}) {
                id
                }
            }`,
            variables: {
                password,
                email,
            },
        })

        console.log(`
            User created:
            email: ${email}
            password: ${password}
            Please change these details after initial login.
        `)
    }
}
