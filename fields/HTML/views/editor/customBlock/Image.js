import React from 'react'

function Image({
    data,
    setData,
    editMode,
    invalidTextFormat,
    setInvalidTextFormat,
    saveBlock,
    removeBlock,
    onClick,
}) {
    const { id, title, urlDesktopSized } = data.selectedData[0]

    return (
        <div
            style={{
                backgroundColor: 'GhostWhite',
                width: '100%',
                height: 'auto',
            }}
        >
            <img
                src={urlDesktopSized}
                alt={title}
                style={{
                    width: '100%',
                    objectFit: 'cover',
                }}
            />
            <h6
                style={{
                    textAlign: 'center',
                    margin: '0',
                    padding: '10px 0',
                }}
            >
                {title}
            </h6>
        </div>
    )
}

export default Image
