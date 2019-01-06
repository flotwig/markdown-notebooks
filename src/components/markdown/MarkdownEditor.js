import React from 'react';

/**
 * Standalone editor for monospace text.
 */
export default class MarkdownEditor extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
    }

    render() {
        // note: do not use blueprint3 TextArea - it does not implement all needed features like selectionStart, onPaste...
        return <textarea 
                className="bp3-input"
                style={{height: '100%', width: '100%', resize: 'none'}}
                placeholder="Begin typing here..."
                value={this.props.markdown} 
                ref={this.props.textareaRef}
                onChange={this.handleChange}
                onPaste={this.props.onPaste}/>
    }

    handleChange(e) {
        let markdown = e.target.value;
        this.props.onChange(markdown)
    }
}