import FieldController from '@keystonejs/fields/Controller'

// controller defines how front-end features work
class NewDateTimeController extends FieldController {
    constructor(config, ...args) {
        super(config, ...args)
    }
    // when save post
    serialize = (data) => {
        console.log('---Save---')
        console.log(data[this.path])
        const savedDateTime = data[this.path]

        if (typeof savedDateTime === 'undefined') {
            const nowUnixTimestamp = Date.now()
            const nowISO8601 = new Date(nowUnixTimestamp).toISOString()
            console.log(nowISO8601)
            return nowISO8601
        } else {
            return data[this.path]
        }
    }

    // when load post
    deserialize = (data) => {
        console.log('---Load---')
        console.log(data[this.path])

        return data[this.path]
    }

    getFilterTypes = () => []
}

export default NewDateTimeController
