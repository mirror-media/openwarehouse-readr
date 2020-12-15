import React, { useState } from 'react'
import ButtonIcon from './button-icon'

function btWrapper(props) {
    const [isToggled, setIsToggled] = useState(false)

    const _toggleModal = () => {
        setIsToggled(!isToggled)
    }

    return (
        <div
            className="Button Button--default"
            style={{ display: 'inline-block' }}
        >
            {React.cloneElement(props.children, {
                ...props.buttonData,
                isModalOpen: isToggled,
                toggleModal: _toggleModal,
            })}
            <ButtonIcon {...props.buttonData} onClick={_toggleModal} />
        </div>
    )
}
// btWrapper.displayName = `ButtonWith${getDisplayName(EditingBlockComponent)}`

export default btWrapper
