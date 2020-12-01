import React, { useState } from 'react'
import { FieldContainer, FieldLabel, FieldDescription } from '@arch-ui/fields'

import { Editor } from 'react-draft-wysiwyg'
import {
    BlockMapBuilder,
    EditorState,
    KeyBindingUtil,
    Modifier,
    Entity,
    RichUtils,
    convertFromHTML,
    convertFromRaw,
    convertToRaw,
    getDefaultKeyBinding,
} from 'draft-js'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const HtmlField = ({ onChange, autoFocus, field, value, errors }) => {
    const initialEditorState = value ? value : EditorState.createEmpty()
    const [editorState, setEditorState] = useState(initialEditorState)

    const onEditorStateChange = (newEditorState) => {
        setEditorState(newEditorState)
        onChange(newEditorState)
    }

    return (
        <FieldContainer>
            <div
                className="editorContainer"
                style={{
                    border: '1px solid #C1C7D0',
                    borderRadius: 3,
                    padding: '2px',
                }}
            >
                <FieldLabel field={field} errors={errors} />
                <FieldDescription text={field.adminDoc} />

                <Editor
                    editorState={editorState}
                    onEditorStateChange={onEditorStateChange}
                />
            </div>
        </FieldContainer>
    )
}

export default HtmlField
