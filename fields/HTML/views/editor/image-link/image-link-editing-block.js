'use strict'
import EntityEditingBlockMixin from '../mixins/entity-editing-block-mixin'
import React from 'react'
import PropTypes from 'prop-types'

export class ImageLinkEditingBlock extends EntityEditingBlockMixin {
    constructor(props) {
        super(props)
        this.state.editingFields = {
            url: props.url,
            description: props.description,
        }
    }

    // overwrite EntityEditingBlock._composeEditingFields
    _composeEditingFields(props) {
        return {
            url: {
                type: 'text',
                value: props.url,
            },
            description: {
                type: 'text',
                value: props.description,
            },
        }
    }

    // overwrite EntityEditingBlock._decomposeEditingFields
    _decomposeEditingFields(fields) {
        return {
            url: fields.url.value,
            description: fields.description.value,
        }
    }
}

ImageLinkEditingBlock.displayName = 'ImageLinkEditingBlock'

// ImageLinkEditingBlock.propTypes = {
// 	description: PropTypes.string,
// 	isModalOpen: PropTypes.bool,
// 	onToggle: PropTypes.func.isRequired,
// 	toggleModal: PropTypes.func,
// 	url: PropTypes.string,
// };

ImageLinkEditingBlock.defaultProps = {
    description: '',
    isModalOpen: false,
    url: '',
}

export default ImageLinkEditingBlock
