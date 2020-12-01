import { EditorState, RichUtils } from 'draft-js'

// Add classname to specific type of contentBlock
// and add custom style on them
export const addClassToContentBlock = (contentBlock) => {
    const type = contentBlock.getType()

    switch (type) {
        case 'blockquote':
            return 'CMSBlockquote'

        default:
            break
    }
}

// Detect every contentBox
// If their type is atomic, make them uneditable.
export const blockRendererFn = (contentBlock) => {
    if (contentBlock.getType() !== 'atomic') return null

    const entityId = contentBlock.getEntityAt(0)

    return {
        // component: AtomicBlock,
        editable: false,
    }
}
