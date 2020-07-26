const crypto = require('crypto');
const { gql } = require('apollo-server-express');
const randomString = () => crypto.randomBytes(6).hexSlice();

module.exports = project => async keystone => {
    // Count existing users
    const {
        data: {
            _allUsersMeta: { count },
        },
    } = await keystone.executeGraphQL(
        {
            query: gql`query {
                        _allUsersMeta {
                            count
                        }
                    }`,
        }
    );

    const projectAdminRole = project === 'readr' ? 'role: "admin"' : 'role: "moderator", isAdmin: true';

    if (count === 0) {
        const password = (process.env.NODE_ENV === 'development') ? 'mirrormedia' : randomString();
        const email = 'admin@mirrormedia.mg';

        await keystone.executeGraphQL({
            query: gql`mutation initialUser($password: String, $email: String) {
                createUser(data: {name: "admin", email: $email, password: $password, ${projectAdminRole}}) {
                id
                }
            }`,
            variables: {
                password,
                email,
            },
        }
        );

        console.log(`
            User created:
            email: ${email}
            password: ${password}
            Please change these details after initial login.
        `);
    }
};