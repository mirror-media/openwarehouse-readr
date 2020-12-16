import React, { useState, useRef } from 'react'
import {
    BlockStyleButtons,
    InlineStyleButtons,
    EntityButtons,
} from './editor/editor-buttons'
import { Button } from 'element-react'

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
import ENTITY from './K3/entities'
import BlockModifier from './editor/modifiers/index'

import decorator from './editor/entity-decorator'
const { isCtrlKeyCommand } = KeyBindingUtil

import AtomicBlockSwitcher from './editor/base/atomic-block-switcher'
import DraftConverter from './K3/draft-converter'
import blockStyleFn from './editor/base/block-style-fn'

import '../../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css'
import './editor/styles/editor.css'

function HtmlDraftEditor({ onChange, autoFocus, field, value, errors }) {
    const initialEditorState = getInitialState(value)
    const [editorState, setEditorState] = useState(initialEditorState)
    const [isEnlarged, setIsEnlarged] = useState(false)
    const mainEditorRef = useRef()
    const [readOnly, setReadOnly] = useState(false)

    // Handle both editorstate and keystone value change
    const onEditorStateChange = (newEditorState) => {
        setEditorState(newEditorState)
        onChange(newEditorState)
    }

    function focus() {
        mainEditorRef.current.focus()
    }

    function getInitialState(value) {
        let editorState
        try {
            if (value) {
                // create an EditorState from the raw Draft data
                let contentState = value.getCurrentContent()
                editorState = EditorState.createWithContent(
                    contentState,
                    decorator
                )
            } else {
                // create empty draft object
                editorState = EditorState.createEmpty(decorator)
            }
        } catch (error) {
            // create empty EditorState
            editorState = EditorState.createEmpty(decorator)
        }

        return editorState

        // return value ? value : EditorState.createEmpty()
    }

    function refreshEditorState(editorState) {
        return EditorState.forceSelection(
            editorState,
            editorState.getCurrentContent().getSelectionAfter()
        )
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
    // function handleKeyCommand(command) {
    //     let newState
    //     switch (command) {
    //         case 'insert-soft-newline':
    //             newState = RichUtils.insertSoftNewline(editorState)
    //             break
    //         default:
    //             newState = RichUtils.handleKeyCommand(editorState, command)
    //     }
    //     if (newState) {
    //         onEditorStateChange(newState)
    //         return true
    //     }
    //     return false
    // }

    function keyBindingFn(e) {
        if (e.keyCode === 13 /* `enter` key */) {
            if (isCtrlKeyCommand(e) || e.shiftKey) {
                return 'insert-soft-newline'
            }
        }
        return getDefaultKeyBinding(e)
    }

    function toggleBlockType(blockType) {
        let newEditorState = RichUtils.toggleBlockType(editorState, blockType)
        onEditorStateChange(newEditorState)
    }

    function toggleInlineStyle(inlineStyle) {
        let newEditorState = RichUtils.toggleInlineStyle(
            editorState,
            inlineStyle
        )
        onEditorStateChange(newEditorState)
    }

    function _toggleTextWithEntity(entityKey, text) {
        const selection = editorState.getSelection()
        let contentState = editorState.getCurrentContent()

        if (selection.isCollapsed()) {
            contentState = Modifier.removeRange(
                editorState.getCurrentContent(),
                selection,
                'backward'
            )
        }
        contentState = Modifier.replaceText(
            contentState,
            selection,
            text,
            null,
            entityKey
        )
        const _editorState = EditorState.push(
            editorState,
            contentState,
            editorState.getLastChangeType()
        )
        onEditorStateChange(_editorState)
    }

    function _toggleAtomicBlock(entity, value) {
        const _editorState = BlockModifier.insertAtomicBlock(
            editorState,
            entity,
            value
        )
        onEditorStateChange(_editorState)
    }

    function _toggleAudio(entity, value) {
        console.log(value)
        const audio = Array.isArray(value) ? value[0] : null
        if (!audio) {
            return
        }
        _toggleAtomicBlock(entity, audio)
    }

    function _toggleVideo(entity, value) {
        console.log(value)
        const video = Array.isArray(value) ? value[0] : null
        if (!video) {
            return
        }
        _toggleAtomicBlock(entity, video)
    }

    function _toggleInlineEntity(entity, value) {
        const entityKey = Entity.create(entity, 'IMMUTABLE', value)
        _toggleTextWithEntity(entityKey, _.get(value, 'text'))
    }

    function _toggleImage(entity, value) {
        const image = Array.isArray(value) ? value[0] : null
        if (!image) {
            return
        }
        _toggleAtomicBlock(entity, image)
    }

    function _toggleImageDiff(entity, value) {
        const images = Array.isArray(value) && value.length === 2 ? value : null
        if (!images) {
            return
        }
        _toggleAtomicBlock(entity, images)
    }

    function _toggleSlideshow(entity, value) {
        const images = Array.isArray(value) && value.length > 0 ? value : null
        if (!images) {
            return
        }
        _toggleAtomicBlock(entity, images)
    }

    function toggleEntity(entity, value) {
        switch (entity) {
            case ENTITY.AUDIO.type:
                return _toggleAudio(entity, value)
            case ENTITY.VIDEO.type:
                return _toggleVideo(entity, value)
            case ENTITY.BLOCKQUOTE.type:
            case ENTITY.IMAGELINK.type:
            case ENTITY.INFOBOX.type:
            case ENTITY.EMBEDDEDCODE.type:
            case ENTITY.YOUTUBE.type:
                return _toggleAtomicBlock(entity, value)
            case ENTITY.ANNOTATION.type:
            case ENTITY.LINK.type:
                return _toggleInlineEntity(entity, value)
            case ENTITY.IMAGE.type:
                return _toggleImage(entity, value)
            case ENTITY.SLIDESHOW.type:
                return _toggleSlideshow(entity, value)
            case ENTITY.IMAGEDIFF.type:
                return _toggleImageDiff(entity, value)
            default:
                return
        }
    }

    function _blockRenderer(block) {
        if (block.getType() === 'atomic') {
            return {
                component: AtomicBlockSwitcher,
                props: {
                    onFinishEdit: (blockKey, valueChanged) => {
                        const _editorState = BlockModifier.handleAtomicEdit(
                            editorState,
                            blockKey,
                            valueChanged
                        )

                        // workaround here.
                        // use refreshEditorState to make the Editor rerender
                        onEditorStateChange(refreshEditorState(_editorState))
                    },
                    refreshEditorState: () => {
                        onEditorStateChange(refreshEditorState(editorState))
                    },
                    data: _convertToApiData(editorState),
                    // render desktop layout when editor is enlarged,
                    // otherwise render mobile layout
                    device: isEnlarged ? 'desktop' : 'mobile',
                    setMainDraftReadOnly: (boolean) => setReadOnly(boolean),
                    isEnlarged: isEnlarged,
                },
            }
        }
        return null
    }

    // for some reason, it'll make audio/video availible to get media data.
    function _convertToApiData(editorState) {
        const content = convertToRaw(editorState.getCurrentContent())
        const apiData = DraftConverter.convertToApiData(content)
        return apiData.toJS()
    }

    function enlargeEditor() {
        // also set editorState to force editor to re-render
        setIsEnlarged(!isEnlarged)
        onEditorStateChange(refreshEditorState(editorState))
    }

    function handlePastedText(text, html, editorstate) {
        // console.log(text)
        // console.log(html)
        // console.log(editorstate)
        function insertFragment(editorState, fragment) {
            let newContent = Modifier.replaceWithFragment(
                editorState.getCurrentContent(),
                editorState.getSelection(),
                fragment
            )
            return EditorState.push(editorState, newContent, 'insert-fragment')
        }

        // if (html) {
        //     // remove meta tag
        //     html = html.replace(/<meta (.+?)>/g, '')
        //     // replace p, h2 by div.
        //     // TODO need to find out how many block tags we need to replace
        //     // currently, just handle p, h1, h2, ..., h6 tag
        //     // NOTE: I don't know why header style can not be parsed into ContentBlock,
        //     // so I replace it by div temporarily
        //     html = html
        //         .replace(/<p|<h1|<h2|<h3|<h4|<h5|<h6/g, '<div')
        //         .replace(/<\/p|<\/h1|<\/h2|<\/h3|<\/h4|<\/h5|<\/h6/g, '</div')

        //     let newEditorState = editorState
        //     var htmlFragment = convertFromHTML(html)
        //     console.log(htmlFragment)
        //     if (htmlFragment) {
        //         var htmlMap = BlockMapBuilder.createFromArray(htmlFragment)
        //         onEditorStateChange(insertFragment(newEditorState, htmlMap))
        //         // prevent the default paste behavior.
        //         return true
        //     }
        // }
        // use default paste behavior
        return false
    }

    const useSpellCheck = true

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let outerClassName = ''
    let className = 'RichEditor-editor'
    let expandIcon = 'fa-expand'
    let expandBtnClass = ''
    let contentState = editorState.getCurrentContent()

    if (!contentState.hasText()) {
        if (
            contentState
                .getBlockMap()
                .first()
                .getType() !== 'unstyled'
        ) {
            className += ' RichEditor-hidePlaceholder'
        }
    }

    if (isEnlarged) {
        outerClassName = 'DraftEditor-fullscreen'
        expandIcon = 'fa-compress'
        expandBtnClass = ' expanded'
    }

    return (
        <div className={outerClassName}>
            <div className="RichEditor-root">
                <div className={'DraftEditor-controls' + expandBtnClass}>
                    <div
                        className={'DraftEditor-controlsInner' + expandBtnClass}
                    >
                        <BlockStyleButtons
                            buttons={BLOCK_TYPES}
                            editorState={editorState}
                            onToggle={toggleBlockType}
                        />

                        <InlineStyleButtons
                            buttons={INLINE_STYLES}
                            editorState={editorState}
                            onToggle={toggleInlineStyle}
                        />

                        <EntityButtons
                            entities={Object.keys(ENTITY)}
                            editorState={editorState}
                            onToggle={toggleEntity}
                        />

                        <Button
                            value="unordered-list-item"
                            className={
                                'hollow-primary DraftEditor-expandButton' +
                                expandBtnClass
                            }
                            onClick={enlargeEditor}
                            aria-haspopup="true"
                            aria-expanded={isEnlarged}
                            title="expand"
                        >
                            <i
                                className={'fa ' + expandIcon}
                                aria-hidden="true"
                            ></i>
                        </Button>
                    </div>
                </div>
                <div
                    className={className + expandBtnClass}
                    onClick={() => focus()}
                >
                    <Editor
                        blockRendererFn={_blockRenderer}
                        blockStyleFn={blockStyleFn}
                        customStyleMap={styleMap}
                        editorState={editorState}
                        handleKeyCommand={handleKeyCommand}
                        handlePastedText={handlePastedText}
                        keyBindingFn={keyBindingFn}
                        onChange={onEditorStateChange}
                        placeholder="Enter HTML Here..."
                        spellCheck={useSpellCheck}
                        ref={mainEditorRef}
                        readOnly={readOnly}
                    />
                </div>
            </div>
        </div>
    )
}

export default HtmlDraftEditor

// Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
}

// block settings
const BLOCK_TYPES = [
    { label: 'Normal', style: 'unstyled', icon: '', text: 'Normal' },
    { label: 'H1', style: 'header-one', icon: 'fa-header', text: 'H1' },
    { label: 'H2', style: 'header-two', icon: 'fa-header', text: 'H2' },
    { label: 'Code Block', style: 'code-block', icon: 'fa-code', text: '' },
    {
        label: 'Blockquote',
        style: 'blockquote',
        icon: 'fa-quote-left',
        text: '',
    },
    { label: 'OL', style: 'ordered-list-item', icon: 'fa-list-ol', text: '' },
    { label: 'UL', style: 'unordered-list-item', icon: 'fa-list-ul', text: '' },
]

// inline style settings
var INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD', icon: 'fa-bold', text: '' },
    { label: 'Italic', style: 'ITALIC', icon: 'fa-italic', text: '' },
    { label: 'Underline', style: 'UNDERLINE', icon: 'fa-underline', text: '' },
    // { label: 'Monospace', style: 'CODE', icon: 'fa-terminal', text: '' },
]
