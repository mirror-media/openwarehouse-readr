import React from 'react'
import PropTypes from 'prop-types'
import EntityEditingBlockMixin from '../mixins/entity-editing-block-mixin'

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
        console.log('_decomposeEditingFields')

        // return formated inputfield's data, make it accessable to Field's entity handler(toggleEntity)
        return {
            quoteBy: fields.quoteBy.value,
            quote: fields.quote.value,
        }
    }
}

BlockQuoteEditingBlock.displayName = 'BlockQuoteEditingBlock'

BlockQuoteEditingBlock.propTypes = {
    isModalOpen: PropTypes.bool,
    onToggle: PropTypes.func,
    quote: PropTypes.string,
    quoteBy: PropTypes.string,
    toggleModal: PropTypes.func,
}

BlockQuoteEditingBlock.defaultProps = {
    isModalOpen: false,
    quote: '',
    quoteBy: '',
}

export default BlockQuoteEditingBlock
