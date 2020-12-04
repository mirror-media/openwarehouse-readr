'use strict'
import BtWrapper from '../base/bt-wrapper'
import BlockQuoteEditingBlock from './block-quote-editing-block'

import React from 'react'

function blockquoteButton(props) {
    return (
        <BtWrapper buttonData={props}>
            <BlockQuoteEditingBlock />
        </BtWrapper>
    )
}

export default blockquoteButton
