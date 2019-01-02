import React from 'react';
import { TextArea } from '@blueprintjs/core';

export default class MarkdownEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markdown: this.props.markdown || ''
        }
        this.handleChange = this.handleChange.bind(this)
    }

    render() {
        return <TextArea 
                style={{height: '100%', width: '100%', resize: 'none'}}
                placeholder="Begin typing here..."
                value={this.state.markdown} 
                onChange={this.handleChange}
                fill={true}/>
    }

    handleChange(e) {
        let markdown = e.target.value;
        if (this.props.onChange) this.props.onChange(markdown)
        this.setState({ markdown })
    }
}