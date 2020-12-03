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
// import React, { useState } from 'react'
// import ButtonIcon from './button-icon'

// function btWrapper(props) {
//     const [isToggled, setIsToggled] = useState(true)

//     function _toggleModal() {
//         setIsToggled(isToggled)
//     }

//     const PASS = { ...props.children }
//     console.log(PASS)

//     return (
//         <div
//             className="Button Button--default"
//             style={{ display: 'inline-block' }}
//             onClick={_toggleModal}
//         >
//             {/* {React.cloneElement(props.children, {
//                 isModalOpen: isToggled,
//                 toggleModal: _toggleModal,
//             })} */}

//             <ButtonIcon {...props} />
//         </div>
//     )
// }
// // btWrapper.displayName = `ButtonWith${getDisplayName(EditingBlockComponent)}`

// export default btWrapper

import React, { Component } from 'react'
import ButtonIcon from './button-icon'

const getDisplayName = (WrappedComponent) =>
    WrappedComponent.displayName || WrappedComponent.name || 'Component'

export class WrapComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isToggled: true,
        }
        this.toggleModal = this._toggleModal.bind(this)
    }

    _toggleModal() {
        this.setState({
            isToggled: !this.state.isToggled,
        })
    }

    render() {
        return (
            <div
                className="Button Button--default"
                style={{ display: 'inline-block' }}
                onClick={this.toggleModal}
            >
                {/* {React.cloneElement(this.props.children, {
                    isModalOpen: this.isToggled,
                    toggleModal: this._toggleModal,
                })} */}
                <ButtonIcon {...this.props.buttonData} />
            </div>
        )
    }
}

// Wrapper.displayName = `ButtonWith${getDisplayName(EditingBlockComponent)}`
// Wrapper.defaultProps = {
//     readOnly: false,
// }

export default WrapComponent

// import ButtonIcon from './button-icon'
// import React, { Component } from 'react';

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
