// 'use strict'
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
// import DraftConverter from '../../K3/draft-converter'
import EntityEditingBlockMixin from '../mixins/entity-editing-block-mixin'
import React from 'react'
import PropTypes from 'prop-types'

export class InfoBoxEditingBlock extends EntityEditingBlockMixin {
    constructor(props) {
        super(props)
        this.state.editorState = this._initEditorState(props.draftRawObj)
    }

    // overwrite EntityEditingBlock._composeEditingFields
    _composeEditingFields(props) {
        return {
            title: {
                type: 'text',
                value: props.title,
            },
            body: {
                type: 'html',
                value: props.body,
            },
        }
    }

    // overwrite EntityEditingBlock._decomposeEditingFields
    _decomposeEditingFields(fields) {
        let { editorState } = this.state
        const content = convertToRaw(editorState.getCurrentContent())
        const cHtml = draftToHtml(content)

        return {
            title: fields.title.value,
            body: cHtml,
            draftRawObj: content,
        }
    }

    // overwrite EntityEditingBlock._handleEditingFieldChange
    _handleEditingFieldChange(field, e) {
        if (field === 'body') {
            return
        }
        return super._handleEditingFieldChange(field, e)
    }
}

InfoBoxEditingBlock.displayName = 'InfoBoxEditingBlock'

// InfoBoxEditingBlock.propTypes = {
// 	body: PropTypes.string,
// 	draftRawObj: PropTypes.object,
// 	isModalOpen: PropTypes.bool,
// 	onToggle: PropTypes.func.isRequired,
// 	title: PropTypes.string,
// 	toggleModal: PropTypes.func,
// };

InfoBoxEditingBlock.defaultProps = {
    body: '',
    draftRawObj: null,
    isModalOpen: false,
    title: '',
}

export default InfoBoxEditingBlock
