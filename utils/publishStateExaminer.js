const publishStateExaminer = async (operation, existingItem, resolvedData, context) => {
    if (operation === 'update' && resolvedData.state === 'published') {
        const currentUserRole = context.req.user.role

        if (currentUserRole === 'contributor') resolvedData.state = existingItem.state
    }
}

module.exports = { publishStateExaminer }
