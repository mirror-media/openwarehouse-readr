import React from 'react'

function Infobox({
    data,
    setData,
    editMode,
    invalidTextFormat,
    setInvalidTextFormat,
    saveBlock,
    removeBlock,
    onClick,
}) {
    const inputChangeHandler = (e) => {
        console.log('changeText')
        setInvalidTextFormat(false)
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

    var editPanel = null
    if (editMode) {
        var buttonClass = 'textInput-saveButton'
        if (invalidTextFormat) {
            buttonClass += ' textInput-invalidButton'
        }

        editPanel = (
            <div className="textInput-panel">
                <input
                    className="textInput-input"
                    onChange={inputChangeHandler}
                    value={data.title}
                    name="title"
                />
                <textarea
                    className="textInput-textarea"
                    onChange={inputChangeHandler}
                    value={data.body}
                    name="body"
                />
                <div className="textInput-buttons">
                    <button
                        className={buttonClass}
                        disabled={invalidTextFormat}
                        onClick={saveBlock}
                    >
                        {invalidTextFormat ? 'Invalid TeX' : 'Done'}
                    </button>
                    <button
                        className="textInput-removeButton"
                        onClick={removeBlock}
                    >
                        Remove
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div
            onClick={onClick}
            className="info-box-container center"
            style={{
                backgroundColor: '#F7F7FF',
                position: 'relative',
                width: '100%',
                float: 'none',
                marginLeft: 0,
                marginRight: 0,
                cursor: 'pointer',
            }}
        >
            <img
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjIzcHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDIzIDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjguMyAoMjk4MDIpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPmljb24taW5mb2JveDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJBcnRpY2xlIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iVG9waWMt4oCTLU1vYmlsZS1Qb3J0cmFpdCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE0OS4wMDAwMDAsIC03MjU2LjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iSW5mb2JveCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDcyNTUuOTEzMDQzKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iTG9nby1Db3B5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNDkuMDAwMDAwLCAwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJpY29uLWluZm9ib3giPgogICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBpZD0iUmVjdGFuZ2xlLTEiIGZpbGw9IiNFNjAwMTIiIHBvaW50cz0iMCAwLjEwNDQ2ODg4OSAxMy43MzU0NDk3IDYuNjA1NDQyMTggMTMuNzM1NDQ5NyAxNy4zOTQ1NTc4IDAgMjMuODk1NjE5NyI+PC9wb2x5Z29uPgogICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBpZD0iUmVjdGFuZ2xlLTIiIGZpbGw9IiNDNzAwMEEiIHBvaW50cz0iMTMuNzM1NDQ5NyA2LjYwNTQ0MjE4IDIyLjQ3NjE5MDUgNC4zNTkyOTY2MSAyMi40NzYxOTA1IDE5LjY1NTEyNjYgMTMuNzM1NDQ5NyAxNy4zOTQ1NTc4Ij48L3BvbHlnb24+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="
                style={{
                    width: '1.27778rem',
                    height: '1.33333rem',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: '-0.66667rem',
                    verticalAlign: 'middle',
                    border: 0,
                }}
            />
            <div
                className="info-box-text"
                style={{
                    padding: '2rem 1.33333rem 1.33333rem 1.33333rem',
                }}
            >
                <h4
                    className="info-box-title"
                    style={{
                        fontSize: '1.11111rem',
                        lineHeight: 1.2,
                        fontWeight: 'bold',
                        margin: 0,
                        marginBottom: '1.27778rem',
                        textAlign: 'center',
                    }}
                >
                    {data.title}
                </h4>
                <div
                    // dangerouslySetInnerHTML={{ __html: body }}
                    style={{
                        padding: '2rem 1.33333rem 1.33333rem 1.33333rem',
                        fontSize: '0.83333rem',
                        lineHeight: 1.8,
                        textAlign: 'justify',
                    }}
                ></div>
                {data.body}
            </div>
            {editPanel}
        </div>
    )
}

export default Infobox
