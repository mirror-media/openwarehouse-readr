const formatChangedList = (changedList) => {
    let changedListObj = JSON.parse(changedList)

    const result = Object.keys(changedListObj).map((key) => {
        return `${key}:${changedListObj[key]}`
    })

    // changeList always has id(arr[0]), but we dont need it
    result.shift()

    const resultString = result.join('\n')

    return resultString
}

module.exports = { formatChangedList }
