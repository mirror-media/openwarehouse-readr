import React, { useState } from 'react'
import {
    AtomicBlockUtils,
    EditorState,
    Modifier,
    ContentBlock,
    genKey,
    convertToRaw,
} from 'draft-js'
import { getSelectionText } from 'draftjs-utils'

import MiniEditor from '../../components/MiniEditor'
import '../../css/main.css'
import { htmlToText } from 'html-to-text'

export const InfoboxType = 'INFOBOX'

export default (props) => {
    const { editorState, onChange } = props
    const getPreSelectedText = () => getSelectionText(editorState)

    const insertBlock = (type, data) => {
        const contentState = editorState.getCurrentContent()
        const contentStateWithEntity = contentState.createEntity(
            type,
            'IMMUTABLE',
            data
        )

        const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

        const editorStateWithEntity = EditorState.set(editorState, {
            currentContent: contentStateWithEntity,
        })

        const editorStateWithAtomicBlock = AtomicBlockUtils.insertAtomicBlock(
            editorStateWithEntity,
            entityKey,
            ' '
        )

        console.log(entityKey)
        console.log(
            convertToRaw(editorStateWithAtomicBlock.getCurrentContent())
        )

        onChange(editorStateWithAtomicBlock)
    }

    const onSave = (title, html) => {
        insertBlock(InfoboxType, {
            entityType: 'infobox',
            title: title,
            body: htmlToText(html),
        })
    }

    return (
        <MiniEditor
            config={prepareLayoutConfig()}
            getPreSelectedText={getPreSelectedText}
            onSave={onSave}
        />
    )
}

const prepareLayoutConfig = () => ({
    style: {
        icon: undefined,
        className: 'fas fa-info-circle',
        title: 'Infobox',
    },
    title: {
        text: 'Infobox',
    },
})
