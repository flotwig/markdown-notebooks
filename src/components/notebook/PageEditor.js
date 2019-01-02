import React from 'react';
import MarkdownEditor from '../markdown/MarkdownEditor';
import MarkdownRenderer from '../markdown/MarkdownRenderer';
import { H2, Card, EditableText } from '@blueprintjs/core'

/**
 * An editor for a single page of a notebook.
 * 
 * <PageEditor page={NotebookPage} handleEdit={(NotebookPage)=>{}}/>
 */
export default class PageEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props.page
        }
        this.handleEdit = this.handleEdit.bind(this)
        this.handleNameChange = this.handleNameChange.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.page !== this.props.page) {
            this.setState({...this.props.page})
        }
    }

    render() {
        return <React.Fragment>
            <div style={{flex: 'auto', display: 'flex', flexDirection: 'column', marginRight: '1%'}}>
                <H2><EditableText value={this.state.name} placeholder="Untitled Page" onChange={this.handleNameChange}/></H2>
                <MarkdownEditor markdown={this.state.content} onChange={this.handleEdit}/>
            </div>
            <Card style={{width: '50%'}}>
                <MarkdownRenderer markdown={this.state.content}/>
            </Card>
        </React.Fragment>
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