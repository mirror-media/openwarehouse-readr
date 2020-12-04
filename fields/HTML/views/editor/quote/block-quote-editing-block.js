'use strict'
import EntityEditingBlockMixin from '../mixins/entity-editing-block-mixin'
import React from 'react'
import PropTypes from 'prop-types'

export class BlockQuoteEditingBlock extends EntityEditingBlockMixin {
    constructor(props) {
        super(props)
    }
    // overwrite EntityEditingBlock._composeEditingFields
    _composeEditingFields(props) {
        return {
            quoteBy: {
                type: 'text',
                value: props.quoteBy,
            },
            quote: {
                type: 'textarea',
                value: props.quote,
            },
        }
    }

    // overwrite EntityEditingBlock._decomposeEditingFields
    _decomposeEditingFields(fields) {
        return {
            quoteBy: fields.quoteBy.value,
            quote: fields.quote.value,
        }
    }
}

BlockQuoteEditingBlock.displayName = 'BlockQuoteEditingBlock'

// BlockQuoteEditingBlock.propTypes = {
// 	isModalOpen: PropTypes.bool,
// 	onToggle: PropTypes.func.isRequired,
// 	quote: PropTypes.string,
// 	quoteBy: PropTypes.string,
// 	toggleModal: PropTypes.func,
// };

BlockQuoteEditingBlock.defaultProps = {
    isModalOpen: false,
    quote: '',
    quoteBy: '',
}

export default BlockQuoteEditingBlock
