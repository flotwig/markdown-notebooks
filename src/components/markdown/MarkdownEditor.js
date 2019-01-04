import React from 'react';

export default class MarkdownEditor extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
    }

    render() {
        return <textarea 
                className="bp3-input"
                style={{height: '100%', width: '100%', resize: 'none'}}
                placeholder="Begin typing here..."
                value={this.props.markdown} 
                ref={this.props.textareaRef}
                onChange={this.handleChange}
                onPaste={this.props.onPaste}
                fill={true}/>
    }

    handleChange(e) {
        let markdown = e.target.value;
        if (this.props.onChange) this.props.onChange(markdown)
    }
}