/** @jsx jsx */
import { jsx } from '@emotion/core'
import {
    Quote,
    Annotation,
    Audio,
    BlockQuote,
    EmbedCode,
    Image,
    Infobox,
    Slideshow,
    Video,
    YouTube,
} from './editor/controls'

// import Quote from './editor/controls/Quote/index'

export const customButtons = [
    <Quote />,
    <Annotation />,
    <BlockQuote />,
    <Infobox />,
    <EmbedCode />,
    <Audio />,
    <Video />,
    <Image />,
    <Slideshow />,
    <YouTube />,
]

export const builtInButtons = {
    options: ['history', 'blockType', 'list', 'inline', 'link'],
    inline: {
        options: ['bold', 'italic', 'underline'],
    },
    blockType: {
        inDropdown: false,
        options: ['Normal', 'H1', 'H2'],
    },
    list: {
        options: ['ordered', 'unordered'],
    },
}
