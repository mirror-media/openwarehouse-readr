import React from 'react'

export default ({ onClick }) => {
    return (
        <i
            className="fas fa-pen-square"
            onClick={onClick}
            style={{
                position: 'absolute',
                fontSize: '50px',
                top: 'calc((100% - 37px) / 2)',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                width: '55px',
                height: '50px',

                backgroundColor: '#FFF',
                borderRadius: '5px',
                textAlign: 'center',
                cursor: 'pointer',
            }}
        />
    )
}
