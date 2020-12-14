import React, { useState } from 'react'
import './AlignedWrapper.style.css'

function AlignedWrapper(props) {
    const [float, setFloat] = useState('left')

    let style = {}
    switch (float) {
        case 'left':
            style = {
                width: '50%',
                float: 'left',
                marginLeft: '0',

                marginRight: '1.11111rem',
            }
            break
        case 'center':
            style = {
                width: '100%',
                float: 'none',
                margin: '0',
            }
            break
        case 'right':
            style = {
                width: '50%',
                float: 'right',
                marginLeft: '1.11111rem',
                marginRight: '',
            }
            break
        default:
            break
    }

    const alignHandler = (position) => {
        setFloat(position)
    }
    return (
        <div className="AlignedWrapper" style={style}>
            {props.children}

            <div className="AlignWrapper__controller">
                <div
                    className="AlignWrapper__controller_btn"
                    contentEditable={false}
                    onClick={() => alignHandler('left')}
                >
                    L
                </div>
                <div
                    className="AlignWrapper__controller_btn"
                    contentEditable={false}
                    onClick={() => alignHandler('center')}
                >
                    M
                </div>
                <div
                    className="AlignWrapper__controller_btn"
                    contentEditable={false}
                    onClick={() => alignHandler('right')}
                >
                    R
                </div>
            </div>
        </div>
    )
}

export default AlignedWrapper
