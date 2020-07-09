import React, { useState } from 'react';
import { EditorState, Modifier } from 'draft-js';
import { getSelectedBlock, getSelectionEntity, getEntityRange } from 'draftjs-utils';

import MiniEditor from '../../components/MiniEditor';
import '../../css/main.css';

export const Type = 'INFOBOX';
export default (props) => {
    const { editorState, onChange } = props;

    const getPreSelectedText = () => getSelectedBlock(editorState).getText();;

    const onSave = (title, html) => {
        const currentEntity = editorState ? getSelectionEntity(editorState) : undefined;
        let selection = editorState.getSelection();

        if (currentEntity) {
            const entityRange = getEntityRange(editorState, currentEntity);
            const isBackward = selection.getIsBackward();
            if (isBackward) {
                selection = selection.merge({
                    anchorOffset: entityRange.end,
                    focusOffset: entityRange.start,
                });
            } else {
                selection = selection.merge({
                    anchorOffset: entityRange.start,
                    focusOffset: entityRange.end,
                });
            }
        }

        let contentState = editorState.getCurrentContent();
        contentState = Modifier.splitBlock(contentState, selection);
        contentState = contentState.createEntity(Type, 'IMMUTABLE', {
            title: title,
            body: html,
        });
        const entityKey = contentState.getLastCreatedEntityKey();

        contentState = Modifier.replaceText(
            contentState,
            selection,
            ' ',
            undefined,
            entityKey
        );

        const newEditorState = EditorState.push(
            editorState,
            contentState,
            'insert-characters'
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
