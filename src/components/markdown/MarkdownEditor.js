import React from 'react';

export default class MarkdownEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markdown: this.props.markdown || ''
        }
        this.handleChange = this.handleChange.bind(this)
    }

    render() {
        return <div>
            <textarea value={this.state.markdown} onChange={this.handleChange}/>
        </div>
    }

    handleChange(e) {
        let markdown = e.target.value;
        if (this.props.onChange) this.props.onChange(markdown)
        this.setState({ markdown })
    }
}