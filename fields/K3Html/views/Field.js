import React, { useState, useEffect, useRef } from 'react'
import { FieldContainer, FieldLabel, FieldDescription } from '@arch-ui/fields'

import {
    BlockMapBuilder,
    Editor,
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
// import { Button, FormInput } from 'elemental'
import ENTITY from './K3/entities'
import decorator from './editor/entity-decorator'

let lastId = 0
function getId() {
    return 'keystone-html-' + lastId++
}

const HtmlField = ({ onChange, autoFocus, field, value, errors }) => {
    const initialEditorState = getInitialState(value)
    const [editorState, setEditorState] = useState(initialEditorState)

    // Handle both editorstate and keystone value change
    const onEditorStateChange = (newEditorState) => {
        setEditorState(newEditorState)
        onChange(newEditorState)
    }

    function getInitialState(value) {
        return value ? value : EditorState.createEmpty()
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
                    onChange={onEditorStateChange}
                />
            </div>
        </FieldContainer>
    )
}

export default HtmlField
