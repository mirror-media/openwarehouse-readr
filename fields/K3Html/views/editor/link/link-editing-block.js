'use strict'
import EntityEditingBlockMixin from '../mixins/entity-editing-block-mixin'
import React from 'react'
import PropTypes from 'prop-types'

export class LinkEditingBlock extends EntityEditingBlockMixin {
    constructor(props) {
        super(props)
        this.state.editingFields = {
            text: props.text,
            url: props.url,
        }
    }

    // overwrite
    _composeEditingFields(props) {
        return {
            text: {
                type: 'text',
                value: props.text,
            },
            url: {
                type: 'text',
                value: props.url,
            },
        }
    }

    // overwrite
    _decomposeEditingFields(fields) {
        return {
            text: fields.text.value,
            url: fields.url.value,
        }
    }
}

LinkEditingBlock.displayName = 'LinkEditingBlock'

// LinkEditingBlock.propTypes = {
// 	isModalOpen: PropTypes.bool,
// 	onToggle: PropTypes.func.isRequired,
// 	text: PropTypes.string,
// 	toggleModal: PropTypes.func,
// 	url: PropTypes.string,
// };

LinkEditingBlock.defaultProps = {
    isModalOpen: false,
    text: '',
    url: '',
}

export default LinkEditingBlock
