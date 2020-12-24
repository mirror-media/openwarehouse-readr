import FieldController from '@keystonejs/fields/Controller'

// controller defines how front-end features work
class NewDateTimeController extends FieldController {
    constructor(config, ...args) {
        super(config, ...args)
    }
   
    validateInput = () => {
        console.log('I am validateInput of NewTimeDate')
    }
    beforeChange = () => {
        console.log('I am beforeChange of NewTimeDate')
    }
    afterChange = () => {
        console.log('I am afterChange of NewTimeDate')
    }

    // // when save post
    // serialize = (data) => {
    //     console.log('---Save---')
    //     console.log(data[this.path])
    //     const savedDateTime = data[this.path]

    //     if (typeof savedDateTime === 'undefined') {
    //         const nowUnixTimestamp = Date.now()
    //         const nowISO8601 = new Date(nowUnixTimestamp).toISOString()
    //         // console.log(nowISO8601)
    //         // return nowISO8601
    //         return data[this.path]
    //     } else {
    //         return data[this.path]
    //     }
    // }

    // // when load post
    // deserialize = (data) => {
    //     console.log('---Load---')
    //     // console.log(data[this.path])

    //     return data[this.path]
    // }

    getFilterTypes = () => []

    validateInputQQ = ({ resolvedData, addFieldValidationError }) => {
        // console.log('I am beforeChange of NewTimeDate')
        // console.log('validateInput')
        // console.log(resolvedData)
        // console.log('-----Check post state-----')
        // const { state, publishTime } = resolvedData
        // if (state === 'draft' && typeof publishTime === 'undefined') {
        //     console.log('verify fail, because of empity time')
        //     addFieldValidationError('verify fail, because of empity time')
        // } else {
        //     console.log('verify success')
        // }
        // console.log('-----Check post state end-----')
    }
}

export default NewDateTimeController
