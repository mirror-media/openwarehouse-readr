const admin = ({ authentication: { item: user } }) =>
    Boolean(user && user.role == 'admin')
const moderator = ({ authentication: { item: user } }) =>
    Boolean(user && user.role == 'moderator')
const editor = ({ authentication: { item: user } }) =>
    Boolean(user && user.role == 'editor')
const contributor = ({ authentication: { item: user } }) =>
    Boolean(user && user.role == 'contributor')

const owner = ({ authentication: { item: user }, listKey }) => {
    if (!user) return false

    if (listKey == 'User') return { id: user.id }

    return { createdBy: { id: user.id } }
}

const allowRoles = (...args) => {
    return (auth) => {
        return args.reduce((result, check) => result || check(auth), false)
    }
}

module.exports = {
    admin,
    moderator,
    editor,
    contributor,
    owner,
    allowRoles,
}
