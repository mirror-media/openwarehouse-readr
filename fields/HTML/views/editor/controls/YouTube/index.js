import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AtomicBlockUtils, EditorState, Modifier } from 'draft-js';
import { getSelectionEntity } from 'draftjs-utils';

import TwoInputs from '../../components/TwoInputs';

class YouTube extends Component {
    static propTypes = {
        editorState: PropTypes.object,
        onChange: PropTypes.func,
        modalHandler: PropTypes.object,
        translations: PropTypes.object,
    };

    constructor(props) {
        super(props);
        const { editorState, modalHandler } = this.props;
        this.state = {
            expanded: false,
            youtube: undefined,
            currentEntity: editorState ? getSelectionEntity(editorState) : undefined,
        };
        modalHandler.registerCallBack(this.expandCollapse);
    }

    componentDidUpdate(prevProps) {
        const { editorState } = this.props;
        if (editorState && editorState !== prevProps.editorState) {
            this.setState({ currentEntity: getSelectionEntity(editorState) });
        }
    }

    componentWillUnmount() {
        const { modalHandler } = this.props;
        modalHandler.deregisterCallBack(this.expandCollapse);
    }

    onExpandEvent = () => {
        this.signalExpanded = !this.state.expanded;
    };

    onChange = (id, description) => {
        const { editorState, onChange } = this.props;
        const { currentEntity } = this.state;
        const contentState = editorState.getCurrentContent();
        const entityKey = editorState
            .getCurrentContent()
            .createEntity('YOUTUBE', 'IMMUTABLE',
                {
                    id: id,
                    description: description,
                }
            )
            .getLastCreatedEntityKey();
        const newEditorState = AtomicBlockUtils.insertAtomicBlock(
            editorState,
            entityKey,
            ' ',
        );

        onChange(newEditorState);
        this.doCollapse();
    };

    getCurrentValues = () => {
        // Do nothing. Don't collect selection.
        return {};
    };

    doExpand = () => {
        this.setState({
            expanded: true,
        });
    };

    expandCollapse = () => {
        this.setState({
            expanded: this.signalExpanded,
        });
        this.signalExpanded = false;
    };

    doCollapse = () => {
        this.setState({
            expanded: false,
        });
    };

    prepareLayoutConfig = () => ({
        style: {
            icon: undefined,
            className: 'fab fa-youtube',
            title: "YouTube Link"
        },
        labels: {
            first: "YouTube ID",
            last: "Description"
        },
        isRequired: {
            first: true,
            last: false
        }
    });

    prepareLayoutCurrentState = (youtube) => ({
        twoInputs: {
            first: (youtube && youtube.id) || '',
            last: (youtube && youtube.description) || '',
        },
    });

    render() {
        const { translations } = this.props;
        const { expanded } = this.state;
        const { youtube } = this.getCurrentValues();
        return (
            <TwoInputs
                translations={translations}
                expanded={expanded}
                onExpandEvent={this.onExpandEvent}
                doExpand={this.doExpand}
                doCollapse={this.doCollapse}
                config={this.prepareLayoutConfig()}
                currentState={this.prepareLayoutCurrentState(youtube)}
                onChange={this.onChange}
            />
        );
    }
}

export default YouTube;
