/** @jsx jsx */
import { jsx } from '@emotion/core';
import { FieldContainer, FieldLabel, FieldDescription } from '@arch-ui/fields';
import { EditorState, RichUtils } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { handleDraftEditorPastedText } from "draftjs-conductor";
import { builtInButtons, customButtons } from './customToolbar';
import decorators from './editor/decorators'

import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


const HtmlField = ({ onChange, autoFocus, field, value, errors }) => {
    const editorState = value ? value : EditorState.createEmpty();

    return (
        <FieldContainer>
            <FieldLabel field={field} errors={errors} />
            <FieldDescription text={field.adminDoc} />
            <div
                style={{
                    border: '1px solid #C1C7D0',
                    borderRadius: 3,
                    padding: '2px',
                }}
            >
                <Editor
                    editorState={editorState}
                    onEditorStateChange={onChange}
                    handlePastedText={handlePastedText}
                    toolbar={builtInButtons}
                    toolbarCustomButtons={customButtons}
                    customDecorators={decorators}
                    handleKeyCommand={(command) => {
                        // RichUtils.handleKeyCommand will handle blocks in different cases which the default behavior of Editor does not handle.
                        const newState = RichUtils.handleKeyCommand(editorState, command)

                        if (newState) {
                            onChange(newState)
                            return 'handled';
                        } else {
                            console.log("editor key command not handled");
                            // Upon receiving 'not-handled', Editor will fallback to the default behavior.
                            return 'not-handled';
                        }
                    }}
                />
            </div>
        </FieldContainer>
    );
};

const handlePastedText = (text, html, editorState, onChange) => {
    let newEditorState = handleDraftEditorPastedText(html, editorState);
    if (newEditorState) {
        onChange(newEditorState);
        return true;
    }
    return false;
}

export default HtmlField;
