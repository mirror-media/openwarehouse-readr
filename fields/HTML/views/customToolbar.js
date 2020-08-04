/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Annotation, Audio, BlockQuote, EmbedCode, Image, Infobox, Slideshow, Video, YouTube } from './editor/controls';

export const customButtons = [
    <Annotation />,
    <BlockQuote />,
    <Infobox />,
    <EmbedCode />,
    <Audio />,
    <Video />,
    <Image />,
    <Slideshow />,
    <YouTube />,
];

export const builtInButtons = {
    options: [
        "history",
        "blockType",
        "list",
        "inline",
        "link",
    ],
    inline: {
        options: [
            "bold",
            "italic",
            "underline",
        ],
    },
    blockType: {
        inDropdown: false,
        options: [
            "Normal",
            "H1",
            "H2",
        ],
    },
    list: {
        options: [
            "ordered",
            "unordered",
        ],
    },
};