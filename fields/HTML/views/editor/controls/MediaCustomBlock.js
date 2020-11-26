import React, { useState, useEffect } from 'react'
import Infobox from '../customBlock/Infobox'
import Image from '../customBlock/Image'
import { convertToRaw } from 'draft-js'

function MediaCustomBlock(props) {
    const getDataFromEntity = () => {
        const { contentState, block } = props
        const entity = contentState.getEntity(block.getEntityAt(0))
        const entityData = entity.getData()

        return entityData
    }

    const [editMode, setEditMode] = useState(false)
    const [data, setData] = useState(getDataFromEntity())
    const [invalidTextFormat, setInvalidTextFormat] = useState(false)

    const onClick = () => {
        if (editMode) return

        setEditMode(true)
        startEdit()
    }

    useEffect(() => {
        if (editMode) {
            startEdit()
        }
    }, [editMode])

    const saveBlock = (e) => {
        e.preventDefault()
        const { block, contentState } = props

        //   get entityKey and newContentState with new entity content
        var entityKey = block.getEntityAt(0)
        var newContentState = contentState.mergeEntityData(entityKey, data)

        //   clear edit state, and call finishEdit
        // setData({})
        setEditMode(false)
        setInvalidTextFormat(false)

        finishEdit(newContentState)
    }

    const removeBlock = () => {
        const { blockProps, block } = props
        blockProps.onRemove(block.getKey())
    }

    const startEdit = () => {
        const { blockProps, block } = props

        blockProps.onStartEdit(block.getKey())
    }

    const finishEdit = (newContentState) => {
        const { blockProps, block } = props

        blockProps.onFinishEdit(block.getKey(), newContentState)
    }

    switch (data.entityType) {
        case 'infobox':
            return (
                <Infobox
                    data={data}
                    setData={setData}
                    editMode={editMode}
                    setEditMode={setEditMode}
                    invalidTextFomat={invalidTextFormat}
                    setInvalidTextFormat={setInvalidTextFormat}
                    saveBlock={saveBlock}
                    removeBlock={removeBlock}
                    onClick={onClick}
                />
            )
            break

        case 'storedImage':
            return (
                <Image
                    data={data}
                    setData={setData}
                    editMode={editMode}
                    setEditMode={setEditMode}
                    invalidTextFomat={invalidTextFormat}
                    setInvalidTextFormat={setInvalidTextFormat}
                    saveBlock={saveBlock}
                    removeBlock={removeBlock}
                    onClick={onClick}
                />
            )
            break

        default:
            return (
                <div>
                    <h1>hihi</h1>
                </div>
            )
            break
    }
}

export default MediaCustomBlock
