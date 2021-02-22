const returnExistedKeyValueBetweenObjects = (targetKey, object1, object2) => {
    // object's priority is greater than object 2

    if (targetKey in object1) {
        // check if object1 has this key
        return object1[targetKey]
    } else if (targetKey in object2) {
        // check if object1 has this key
        return object2[targetKey]
    } else return null
}

module.exports = { returnExistedKeyValueBetweenObjects }
