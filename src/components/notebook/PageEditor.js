import React from 'react';
import MarkdownEditor from '../markdown/MarkdownEditor';
import MarkdownRenderer from '../markdown/MarkdownRenderer';
import { Card, Divider } from '@blueprintjs/core'

export default class PageEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markdown: ''
        }
        this.handleEdit = this.handleEdit.bind(this)
    }

    render() {
        return <Divider style={{display: 'flex', height: '100%', margin: 0, padding: '1em'}}>
            <div style={{width: '49%', marginRight: '1%'}}>
                <MarkdownEditor markdown={this.state.markdown} onChange={this.handleEdit}/>
            </div>
            <Card style={{width: '50%'}}>
                <MarkdownRenderer markdown={this.state.markdown}/>
            </Card>
        </Divider>
    }

    handleEdit(markdown) {
        this.setState({ markdown })
    }
}