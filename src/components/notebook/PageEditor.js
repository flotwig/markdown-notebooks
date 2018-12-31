import React from 'react';
import MarkdownEditor from '../markdown/MarkdownEditor';
import MarkdownRenderer from '../markdown/MarkdownRenderer';
import { H2, Card, Divider, EditableText } from '@blueprintjs/core'

export default class PageEditor extends React.Component {
    constructor(props) {
        super(props);
        this.handleEdit = this.handleEdit.bind(this)
        this.handleNameChange = this.handleNameChange.bind(this)
    }

    static getDerivedStateFromProps(props, state) {
        return {...props.page}
    }

    render() {
        return <Divider style={{display: 'flex', height: '100%', margin: 0, padding: '1em'}}>
            <div style={{width: '49%', marginRight: '1%'}}>
                <H2><EditableText value={this.state.name} placeholder="Untitled Page"/></H2>
                <MarkdownEditor markdown={this.state.content} onChange={this.handleEdit}/>
            </div>
            <Card style={{width: '50%'}}>
                <MarkdownRenderer markdown={this.state.content}/>
            </Card>
        </Divider>
    }

    handleEdit(content) {
        this.setState({ content })
        this.props.handleEdit && this.props.handleEdit({ name: this.state.name, content })
    }

    handleNameChange(name) {
        this.setState({ name })
        this.props.handleEdit && this.props.handleEdit({ name, content: this.state.content })
    }
}