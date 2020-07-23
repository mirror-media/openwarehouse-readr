import React, { useState } from 'react';
import { AtomicBlockUtils, EditorState, Modifier } from 'draft-js';
import { getSelectionText } from 'draftjs-utils';

import MiniEditor from '../../components/MiniEditor';
import '../../css/main.css';

export const InfoboxType = 'INFOBOX';
export default (props) => {
    const { editorState, onChange } = props;

    const getPreSelectedText = () => getSelectionText(editorState);;

    const onSave = (title, html) => {
        const contentState = editorState.getCurrentContent();
        const entityKey = editorState
            .getCurrentContent()
            .createEntity(InfoboxType, 'IMMUTABLE', {
                title: title,
                body: html,
            })
            .getLastCreatedEntityKey();
        const newEditorState = AtomicBlockUtils.insertAtomicBlock(
            editorState,
            entityKey,
            ' ',
        );

        onChange(newEditorState);
    };

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
});
