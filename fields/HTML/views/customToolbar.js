/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Annotation, Audio, BlockQuote, EmbedCode, Image, Infobox, Slideshow, Video, YouTube } from './editor/controls';

export const customButtons = [
    <YouTube />,
    <EmbedCode />,
    <BlockQuote />,
    <Annotation />,
    <Infobox />,
    <Image />,
    <Slideshow />,
    <Video />,
    <Audio />,
];

export const builtInButtons = {
    options: [
        "inline",
        "blockType",
        "list",
        "link",
        "image",
        "history",
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
            "Blockquote",
        ],
    },
    list: {
        options: ["unordered", "ordered"],
    },
};