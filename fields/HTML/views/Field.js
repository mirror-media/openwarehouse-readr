import React, { useState, useEffect, useRef } from 'react'
import { FieldContainer, FieldLabel, FieldDescription } from '@arch-ui/fields'

import { Editor } from 'react-draft-wysiwyg'
import {
    EditorState,
    RichUtils,
    CompositeDecorator,
    convertToRaw,
} from 'draft-js'
import { handleDraftEditorPastedText } from 'draftjs-conductor'
import { builtInButtons, customButtons } from './customToolbar'
import decorators from './editor/decorators'

import { Zoom } from './editor/controls'
import { addClassToContentBlock } from './draftPropsHandler'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './editor/css/fixSectionPosition.css'
import './editor/css/TeXEditor.css'
import decorator from './K3/entity-decorator'

import { Map } from 'immutable'
import { insertTeXBlock } from './editor/utils/modifiers/insertTeXBlock'
import { removeTeXBlock } from './editor/utils/modifiers/removeTeXBlock'
import MediaCustomBlock from './editor/controls/MediaCustomBlock'

const HtmlField = ({ onChange, autoFocus, field, value, errors }) => {
    const initialEditorState = value ? value : EditorState.createEmpty()
    const [editorState, setEditorState] = useState(initialEditorState)
    const [textContentBlock, setTextContentBlock] = useState(Map())
    const editorRef = useRef()

    // Handle both editorstate and keystone value change
    const onEditorStateChange = (newEditorState) => {
        setEditorState(newEditorState)
        onChange(newEditorState)
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

    // Detect every contentBox
    const blockRendererFn = (contentBlock) => {
        // if (contentBlock.getType() !== 'atomic') return null
        // console.log(contentBlock.getType())
        if (contentBlock.getType() === 'atomic') {
            return {
                component: MediaCustomBlock,
                editable: false,
                props: {
                    onStartEdit: (blockKey) => {
                        //   something important, but i can't figure out WTF is this.
                        setTextContentBlock(
                            textContentBlock.set(blockKey, true)
                        )
                    },
                    onFinishEdit: (blockKey, newContentState) => {
                        setTextContentBlock(textContentBlock.remove(blockKey))

                        const newEditorState = EditorState.createWithContent(
                            newContentState
                        )

                        onEditorStateChange(newEditorState)
                    },
                    onRemove: (blockKey) => removeTeX(blockKey),
                },
            }
        }

        if (contentBlock.getType() !== 'atomic') return null
        return {
            // component: AtomicBlock,
            editable: false,
        }
    }

    const removeTeX = (blockKey) => {
        setEditorState(removeTeXBlock(editorState, blockKey))
        setTextContentBlock(textContentBlock.remove(blockKey))
    }
    // const insertTeX = (e) => {
    //     e.preventDefault()
    //     setTextContentBlock(Map())
    //     setEditorState(insertTeXBlock(editorState))
    // }
    // const focus = () => {
    //     editorRef.current.editor.focus()
    // }

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
                    ref={editorRef}
                    readOnly={textContentBlock.count()}
                />
            </div>
        </FieldContainer>
    )
}

export default HtmlField
