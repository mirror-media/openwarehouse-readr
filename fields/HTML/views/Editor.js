import React, { useState, useEffect } from 'react'
import { Editor, EditorState } from 'draft-js'

function DraftEditor(props) {
    const { value, onChange } = props
    const [editorState, setEditorState] = useState(
        value ? value : EditorState.createEmpty()
    )

    // useEffect(() => {
    //     console.log(value === props.value)
    // }, [props])

    const onEditorStateChange = (newEditorState) => {
        setEditorState(newEditorState)
        // onChange(newEditorState)
        // console.log(setEditorState)
    }

    return (
        <Editor
            editorState={editorState}
            onChange={onEditorStateChange}
            placeholder="Enter HTML Here..."
        />
        // <input type="text" />
    )
}

export default DraftEditor
