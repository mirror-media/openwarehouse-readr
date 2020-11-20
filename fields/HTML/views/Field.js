import React, { useState } from 'react'
import { FieldContainer, FieldLabel, FieldDescription } from '@arch-ui/fields'

import { Editor } from 'react-draft-wysiwyg'
import { EditorState, RichUtils } from 'draft-js'
import { handleDraftEditorPastedText } from 'draftjs-conductor'
import { builtInButtons, customButtons } from './customToolbar'
import decorators from './editor/decorators'

import { Zoom } from './editor/controls'
import { addClassToContentBlock, blockRendererFn } from './draftPropsHandler'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './editor/css/fixSectionPosition.css'

const HtmlField = ({ onChange, autoFocus, field, value, errors }) => {
    const initialEditorState = value ? value : EditorState.createEmpty()
    const [editorState, setEditorState] = useState(initialEditorState)

    // Handle both editorstate and keystone value change
    const onEditorStateChange = (newEditorState) => {
        onChange(newEditorState)
        setEditorState(newEditorState)
    }

    // After receiving key command, generate new state from RichUtils, and update state.
    const handleKeyCommand = (command, editorState) => {
        // RichUtils.handleKeyCommand will handle blocks in different cases which the default behavior of Editor does not handle.
        const newState = RichUtils.handleKeyCommand(editorState, command)

        if (newState) {
            onEditorStateChange(newState)
            return 'handled'
        } else {
            // Upon receiving 'not-handled', Editor will fallback to the default behavior.
            return 'not-handled'
        }
    }

    // ??
    const handlePastedText = (text, html, editorState, onChange) => {
        let newEditorState = handleDraftEditorPastedText(html, editorState)
        if (newEditorState) {
            onChange(newEditorState)
            return true
        }
        return false
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
                <Zoom />

                <Editor
                    editorState={editorState}
                    onEditorStateChange={onEditorStateChange}
                    handlePastedText={handlePastedText}
                    toolbar={builtInButtons}
                    toolbarCustomButtons={customButtons}
                    customDecorators={decorators}
                    handleKeyCommand={handleKeyCommand}
                    placeholder="請輸入文字"
                    blockStyleFn={addClassToContentBlock}
                    blockRendererFn={blockRendererFn}
                />
            </div>
        </FieldContainer>
    )
}

export default HtmlField
