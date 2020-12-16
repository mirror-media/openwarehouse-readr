import FieldController from '@keystonejs/fields/Controller'
import {
    convertDbDataToEditorState,
    convertEditorStateToDbData,
} from './editorToBackendUtil/dataConverter'

// controller defines how front-end features work
class HtmlController extends FieldController {
    constructor(config, ...args) {
        super(config, ...args)
    }

    // when save post, format data from editorState to specified object, then return to db.
    serialize = (data) => {
        return data.content
            ? JSON.stringify(convertEditorStateToDbData(data.content))
            : undefined
    }

    // when lode post, format data from db object to editorState, then return to editor.
    deserialize = (data) => {
        return convertDbDataToEditorState(
            data.content ? JSON.parse(data.content) : undefined
        )
    }

    getFilterTypes = () => []
}

export default HtmlController
