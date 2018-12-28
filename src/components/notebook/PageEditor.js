import React from 'react';
import MarkdownEditor from '../markdown/MarkdownEditor';
import MarkdownRenderer from '../markdown/MarkdownRenderer';

export default class PageEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markdown: ''
        }
        this.handleEdit = this.handleEdit.bind(this)
    }

    render() {
        return <div>
            <MarkdownEditor markdown={this.state.markdown} onChange={this.handleEdit}/>
            <MarkdownRenderer markdown={this.state.markdown}/>
        </div>
    }

    handleEdit(markdown) {
        this.setState({ markdown })
    }
}