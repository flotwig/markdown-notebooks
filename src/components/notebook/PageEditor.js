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
            name: props.page.name,
            content: props.page.content
        }
        this.handleEdit = this.handleEdit.bind(this)
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handlePaste = this.handlePaste.bind(this)
        this.textareaRef = React.createRef();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.page.name !== this.props.page.name 
                || prevProps.page.content !== this.props.page.content) {
            this.setState({
                name: this.props.page.name,
                content: this.props.page.content
            })
        }
    }

    render() {
        return <React.Fragment>
            <div style={{width: '50%', flex: 'auto', display: 'flex', flexDirection: 'column', marginRight: '1%'}}>
                <div style={{maxWidth: '100%', overflow: 'clip'}}>
                    <H2>
                        <EditableText value={this.state.name} 
                                    placeholder="Untitled Page" 
                                    onChange={(name)=>this.setState({ name })}
                                    onConfirm={this.handleNameChange}/>
                    </H2>
                </div>
                <MarkdownEditor markdown={this.state.content} 
                                onChange={this.handleEdit}
                                textareaRef={this.textareaRef}
                                onPaste={this.handlePaste}/>
            </div>
            <Card style={{width: '40%', height: '100%', overflow: 'auto'}}>
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

    handlePaste(e) {
        // cancel default behavior and stop bubbling
        e.preventDefault();
        e.stopPropagation();
        let items = e.clipboardData.items
        for (var i = 0; i < items.length; i++) {
            let item = items[i]
            if (item.type.includes('image')) {
                const cursorLocation = this.textareaRef.current.selectionStart
                const blob = item.getAsFile()
                this.props.uploadImage(blob, cursorLocation)
            }
        }
    }
}