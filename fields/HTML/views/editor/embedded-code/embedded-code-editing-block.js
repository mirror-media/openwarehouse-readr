// 'use strict'
import EntityEditingBlockMixin from '../mixins/entity-editing-block-mixin'
import React from 'react'

export class EmbeddedCodeEditingBlock extends EntityEditingBlockMixin {
    constructor(props) {
        super(props)
        this.state.editingFields = {
            caption: props.caption,
            code: props.embeddedCode,
        }
    }

    // overwrite
    _composeEditingFields(props) {
        return {
            caption: {
                type: 'text',
                value: props.caption,
            },
            code: {
                type: 'textarea',
                value: props.code,
            },
        }
    }

    // overwrite
    _decomposeEditingFields(fields) {
        return {
            caption: fields.caption.value,
            code: fields.code.value,
        }
    }
}

EmbeddedCodeEditingBlock.displayName = 'EmbeddedCodeEditingBlock'

// EmbeddedCodeEditingBlock.propTypes = {
// 	caption: React.PropTypes.string,
// 	embeddedCode: React.PropTypes.string,
// 	isModalOpen: React.PropTypes.bool,
// 	onToggle: React.PropTypes.func.isRequired,
// 	toggleModal: React.PropTypes.func,
// };

EmbeddedCodeEditingBlock.defaultProps = {
    caption: '',
    embeddedCode: '',
    isModalOpen: false,
}

export default EmbeddedCodeEditingBlock
