import React, { useState } from 'react'

function AlignedWrapper(props) {
    console.log(props.children)
    const [float, setFloat] = useState('left')
    return <div className="AlignedWrapper">{props.children}</div>
}

export default AlignedWrapper
