const controlCharacterFilter = (originalInput, existingItem, resolvedData) => {
    const modifiedList = Object.keys(originalInput)

    const rules = /[\u0000-\u001F\u007F-\u009F]/g
    modifiedList.forEach((modifiedKey) => {
        console.log(`checking for ${modifiedKey}'s contorl character...`)
        if (!resolvedData[modifiedKey]) return

        resolvedData[modifiedKey] = resolvedData[modifiedKey].replace(rules, '')
    })
}

module.exports = { controlCharacterFilter }
