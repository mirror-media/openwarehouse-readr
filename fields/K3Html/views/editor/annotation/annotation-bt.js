/**/
'use strict'
import BtWrapper from '../base/bt-wrapper'
import AnnotationEditingBlock from './annotation-editing-block'

import React from 'react'

function annotationButton(props) {
    return (
        <BtWrapper buttonData={props}>
            <AnnotationEditingBlock />
        </BtWrapper>
    )
}

export default annotationButton
