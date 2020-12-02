import FieldController from '@keystonejs/fields/Controller'
import { convertToEditorState, fetchData } from './dataConverter'
import {
    createEditorStateFromRaw,
    serialiseEditorStateToRaw,
} from 'draftjs-conductor'

// controller defines how front-end features work
class HtmlController extends FieldController {
    constructor(config, ...args) {
        super(config, ...args)
    }

    serialize = (data) => {
        return data[this.path]
            ? JSON.stringify(fetchData(data[this.path]))
            : undefined
    }

    deserialize = (data) => {
        return convertToEditorState(
            data[this.path] ? JSON.parse(data[this.path]) : undefined
        )
    }

    getFilterTypes = () => []
}

export default HtmlController