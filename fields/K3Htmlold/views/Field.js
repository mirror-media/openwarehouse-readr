import React, { useState, useEffect, useRef } from 'react'
import { FieldContainer, FieldLabel, FieldDescription } from '@arch-ui/fields'

// import {
//     BlockMapBuilder,
//     Editor,
//     EditorState,
//     KeyBindingUtil,
//     Modifier,
//     Entity,
//     RichUtils,
//     convertFromHTML,
//     convertFromRaw,
//     convertToRaw,
//     getDefaultKeyBinding,
// } from 'draft-js'
// import {
//     BlockStyleButtons,
//     EntityButtons,
//     InlineStyleButtons,
// } from './editor/editor-buttons'
// import { Button, FormInput } from 'elemental'
// import ENTITY from './editor/entities'
// import AtomicBlockSwitcher from './editor/base/atomic-block-switcher'
// import BlockModifier from './editor/modifiers/index'
// import DraftConverter from './editor/draft-converter'
// import Field from '../Field'
// import blockStyleFn from './editor/base/block-style-fn'
// import decorator from './editor/entity-decorator'
// const { isCtrlKeyCommand } = KeyBindingUtil

// import { handleDraftEditorPastedText } from 'draftjs-conductor'
// import { builtInButtons } from './customToolbar'

// import { addClassToContentBlock } from './draftPropsHandler'

// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

// import { Map } from 'immutable'

// const getInitialState = (value) => {
//     // convert saved editor content into the editor state
//     let editorState
//     try {
//         const { draft, html } = value
//         if (draft && html !== '') {
//             // create an EditorState from the raw Draft data
//             let contentState = convertFromRaw(draft)
//             editorState = EditorState.createWithContent(contentState, decorator)
//         } else {
//             // create empty draft object
//             editorState = EditorState.createEmpty(decorator)
//         }
//     } catch (error) {
//         // create empty EditorState
//         editorState = EditorState.createEmpty(decorator)
//     }

//     return {
//         editorState: editorState,
//         id: getId(),
//         valueStr: JSON.stringify(this.props.value),
//     }
// }

const HtmlField = ({ onChange, autoFocus, field, value, errors }) => {
    console.log(value)
    // const initialEditorState = getInitialState(value)
    // const [editorState, setEditorState] = useState(initialEditorState)
    // const [textContentBlock, setTextContentBlock] = useState(Map())
    // const editorRef = useRef()

    // // Handle both editorstate and keystone value change
    // const onEditorStateChange = (newEditorState) => {
    //     setEditorState(newEditorState)
    //     onChange(newEditorState)
    // }

    // // After receiving key command, generate new state from RichUtils, and update state.
    // const handleKeyCommand = (command, editorState) => {
    //     // RichUtils.handleKeyCommand will handle blocks in different cases which the default behavior of Editor does not handle.
    //     const newState = RichUtils.handleKeyCommand(editorState, command)

    //     if (newState) {
    //         onEditorStateChange(newState)
    //         return 'handled'
    //     } else {
    //         // Upon receiving 'not-handled', Editor will fallback to the default behavior.
    //         return 'not-handled'
    //     }
    // }

    // // ??
    // const handlePastedText = (text, html, editorState, onChange) => {
    //     let newEditorState = handleDraftEditorPastedText(html, editorState)
    //     if (newEditorState) {
    //         onChange(newEditorState)
    //         return true
    //     }
    //     return false
    // }

    return <h1>YOYO</h1>
    // return (
    //     <FieldContainer>
    //         <div
    //             className="editorContainer"
    //             style={{
    //                 border: '1px solid #C1C7D0',
    //                 borderRadius: 3,
    //                 padding: '2px',
    //             }}
    //         >
    //             <FieldLabel field={field} errors={errors} />
    //             <FieldDescription text={field.adminDoc} />
    //             <Zoom />

    //             <Editor
    //                 editorState={editorState}
    //                 onEditorStateChange={onEditorStateChange}
    //                 handlePastedText={handlePastedText}
    //                 toolbar={builtInButtons}
    //                 toolbarCustomButtons={customButtons}
    //                 // customDecorators={decorators}
    //                 handleKeyCommand={handleKeyCommand}
    //                 placeholder="請輸入文字"
    //                 blockStyleFn={addClassToContentBlock}
    //                 blockRendererFn={blockRendererFn}
    //                 ref={editorRef}
    //                 readOnly={textContentBlock.count()}
    //             />
    //         </div>
    //     </FieldContainer>
    // )
}

export default HtmlField
