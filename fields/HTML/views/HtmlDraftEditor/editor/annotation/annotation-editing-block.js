import React from 'react'
import PropTypes from 'prop-types'
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import EntityEditingBlockMixin from '../mixins/entity-editing-block-mixin'
import get from 'lodash/get'

const _ = {
    get,
}

export class AnnotationEditingBlock extends EntityEditingBlockMixin {
    constructor(props) {
        super(props)
        this.state.editorState = this._initEditorState(props.draftRawObj)
    }

    // overwrite
    _composeEditingFields(props) {
        return {
            text: {
                type: 'text',
                value: props.text,
            },
            annotation: {
                type: 'html',
                value: props.annotation,
            },
        }
    }

    // overwrite
    _decomposeEditingFields(fields) {
        let { editorState } = this.state
        const content = convertToRaw(editorState.getCurrentContent())
        const cHtml = draftToHtml(content, {
            unstyled: `<div>%content%</div>`,
        })
        return {
            // annotated text
            text: fields.text.value,
            annotation: cHtml,
            pureAnnotationText: _.get(content, ['blocks', 0, 'text'], ''),
            draftRawObj: content,
        }
    }

    // overwrite EntityEditingBlock._handleEditingFieldChange
    _handleEditingFieldChange(field, e) {
        if (field === 'annotation') {
            return
        }
        return super._handleEditingFieldChange(field, e)
    }
}

AnnotationEditingBlock.displayName = 'AnnotationEditingBlock'

AnnotationEditingBlock.propTypes = {
    annotation: PropTypes.string,
    draftRawObj: PropTypes.object,
    isModalOpen: PropTypes.bool,
    onToggle: PropTypes.func,
    text: PropTypes.string,
    toggleModal: PropTypes.func,
}

AnnotationEditingBlock.defaultProps = {
    annotation: '',
    draftRawObj: null,
    isModalOpen: false,
    text: '',
}

export default AnnotationEditingBlock
