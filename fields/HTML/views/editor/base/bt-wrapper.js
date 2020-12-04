// import ButtonIcon from './button-icon'
// import React, { Component } from 'react';

// const getDisplayName = (WrappedComponent) =>
//     WrappedComponent.displayName || WrappedComponent.name || 'Component'

// // Export
// export default function WrapComponent (EditingBlockComponent) {
// 	class Wrapper extends Component {
// 		constructor (props) {
// 			super(props);
// 			this.state = {
// 				isToggled: true,
// 			};
// 			this.toggleModal = this._toggleModal.bind(this);
// 		}

// 		_toggleModal () {
// 			this.setState({
// 				isToggled: !this.state.isToggled,
// 			});
// 		}

// 		render () {
// 			return (
// 				<div
// 					className="Button Button--default"
// 					style={{ display: 'inline-block' }}
// 					onClick={this.toggleModal}
// 				>
// 					<EditingBlockComponent
// 						{...this.props}
// 						isModalOpen={!this.state.isToggled}
// 						toggleModal={this.toggleModal}
// 					/>
// 					<ButtonIcon
// 						{...this.props}
// 					/>
// 				</div>
// 			);
// 		}
// 	}
// 	Wrapper.displayName = `ButtonWith${getDisplayName(EditingBlockComponent)}`;
// 	Wrapper.defaultProps = {
// 		readOnly: false,
// 	};

// 	return Wrapper;
// }
// --------------------------------------------
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

// import React, { Component } from 'react'
// import ButtonIcon from './button-icon'

// const getDisplayName = (WrappedComponent) =>
//     WrappedComponent.displayName || WrappedComponent.name || 'Component'

// export class WrapComponent extends Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             isToggled: true,
//         }
//         this.toggleModal = this._toggleModal.bind(this)
//     }

//     _toggleModal() {
//         console.log(this)
//         // this.setState({
//         //     isToggled: !this.state.isToggled,
//         // })
//     }

//     render() {
//         return (
//             <div
//                 className="Button Button--default"
//                 style={{ display: 'inline-block' }}
//                 onClick={() => this._toggleModal}
//             >
//                 {React.cloneElement(this.props.children, {
//                     ...this.props.buttonData,
//                     isModalOpen: this.isToggled,
//                     toggleModal: this._toggleModal,
//                 })}
//                 {this.isToggled}
//                 <ButtonIcon {...this.props.buttonData} />
//             </div>
//         )
//     }
// }

// // Wrapper.displayName = `ButtonWith${getDisplayName(EditingBlockComponent)}`
// // Wrapper.defaultProps = {
// //     readOnly: false,
// // }

// export default WrapComponent
