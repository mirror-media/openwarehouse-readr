// 'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import EntityEditingBlockMixin from '../mixins/entity-editing-block-mixin'

export class YoutubeEditingBlock extends EntityEditingBlockMixin {
    constructor(props) {
        super(props)

        this.state = {
            editingFields: {
                youtubeId: props.youtubeId,
                description: props.description,
            },
        }
    }

    // overwrite
    _composeEditingFields(props) {
        return {
            youtubeId: {
                type: 'text',
                value: props.youtubeId,
            },
            description: {
                type: 'textarea',
                value: props.description,
            },
        }
    }
    // overwrite
    _decomposeEditingFields(fields) {
        return {
            youtubeId: fields.youtubeId.value,
            description: fields.description.value,
        }
    }
}

YoutubeEditingBlock.displayName = 'YoutubeEditingBlock'
YoutubeEditingBlock.propTypes = {
    description: PropTypes.string,
    isModalOpen: PropTypes.bool,
    onToggle: PropTypes.func,
    toggleModal: PropTypes.func,
    youtubeId: PropTypes.string,
}

YoutubeEditingBlock.defaultProps = {
    description: '',
    isModalOpen: false,
    youtubeId: '',
}

export default YoutubeEditingBlock
