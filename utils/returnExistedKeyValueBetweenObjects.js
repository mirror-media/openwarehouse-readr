const returnExistedKeyValueBetweenObjects = (targetKey, object1, object2) => {
    // object's priority is greater than object 2

    if (object1 && targetKey in object1) {
        // check if object1 has this key
        return object1[targetKey]
    } else if (object2 && targetKey in object2) {
        // check if object1 has this key
        return object2[targetKey]
    } else return false
}

module.exports = { returnExistedKeyValueBetweenObjects }
