// 'use strict'
import BtWrapper from '../base/bt-wrapper'
import EmbeddedCodeEditingBlock from './embedded-code-editing-block'

import React from 'react'

function embeddedCodeButton(props) {
    return (
        <BtWrapper buttonData={props}>
            <EmbeddedCodeEditingBlock />
        </BtWrapper>
    )
}

export default embeddedCodeButton
