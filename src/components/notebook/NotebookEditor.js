import React from 'react';
import MarkdownEditor from '../markdown/MarkdownEditor';
import MarkdownRenderer from '../markdown/MarkdownRenderer';
import ConnectedOpenMenu from './OpenMenu';
import PageList from './PageList';
import { 
    Icon, Button, ButtonGroup, Divider, Dialog, 
    NonIdealState, Spinner, H2, H4, EditableText, Card
} from '@blueprintjs/core';

/**
 * Editor pane for a notebook. Includes all the needed controls.
 */
export default class NotebookEditor extends React.Component {
    constructor(props) {
        super(props)
        const activePage = this.getActivePage()
        this.state = {
            isOpenMenuOpen: false,
            activePageContent: activePage.content,
            activePageName: activePage.name,
            notebookName: this.props.notebook.name
        }
        this.onClickSave = this.onClickSave.bind(this)
        this.onClickOpen = this.onClickOpen.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handlePageNameChange = this.handlePageNameChange.bind(this)
        this.handleNotebookNameChange = this.handleNotebookNameChange.bind(this)
        this.handlePaste = this.handlePaste.bind(this)
        this.textareaRef = React.createRef();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.activePageId !== this.props.activePageId) {
            const activePage = this.getActivePage()
            this.setState({
                activePageContent: activePage.content,
                activePageName: activePage.name
            })
        }
        if (prevProps.notebook.name !== this.props.notebook.name) {
            this.setState({
                notebookName: this.props.notebook.name
            })
        }
    }

    render() {
        return (
            <React.Fragment>
                <Dialog onClose={()=>this.setState({ isOpenMenuOpen: false })}
                        isOpen={this.state.isOpenMenuOpen} 
                        title="Open a notebook">
                    <ConnectedOpenMenu closeMenu={()=>{this.setState({ isOpenMenuOpen: false })}}/>
                </Dialog>
                <div style={{display: 'flex', width: '100%', height: '100%', margin: 0, padding: '1em'}}>
                    <div style={{display: 'flex', width: '10%', flexDirection: 'column', marginRight: '1em'}}>
                        <div style={{fontWeight: '600', fontSize: '1.1em', paddingBottom: '1em', textAlign: 'center'}}>
                            <Icon icon="book" iconSize="60" style={{marginBottom: '.2em'}}></Icon><br/>
                            Markdown<br/>
                            Notebooks
                        </div>
                        <ButtonGroup alignText="right" minimal={true} vertical={true}>
                            <Button text="Save" icon="cloud-upload" onClick={this.onClickSave}/>
                            <Button text="Open" icon="cloud-download" onClick={this.onClickOpen}/>
                            <Divider/>
                            <Button text="New Page" onClick={()=>this.props.addPage()}/>
                            <Button text="Delete Page" onClick={()=>this.props.deletePage()}/>
                            <Divider/>
                        </ButtonGroup>
                        {this.props.notebook && <PageList pages={this.props.notebook.pages} 
                                                          activePage={this.getActivePage()} 
                                                          onClickPage={this.props.setActivePage}/>
                        }
                    </div>
                    {this.props.isLoadingNotebook ? this.renderLoading() : (!this.props.notebook ? this.renderNoNotebook() : this.renderEditor())}
                </div>
            </React.Fragment>
        )
    }

    renderLoading() {
        return <NonIdealState icon={<Spinner/>} description="Loading notebook..."/>
    }

    renderNoNotebook() {
        return <NonIdealState icon="clean" description="Open a notebook to start editing."/>
    }

    renderEditor() {
        return (
            <React.Fragment>
                <div style={{width: '50%', flex: 'auto', display: 'flex', flexDirection: 'column', marginRight: '1%'}}>
                    <div style={{maxWidth: '100%'}}>
                        <H2>
                            <EditableText value={this.state.notebookName} 
                                        placeholder="Untitled Page" 
                                        onChange={(notebookName)=>this.setState({ notebookName })}
                                        onConfirm={this.handleNotebookNameChange}/>
                        </H2>
                        <H4>
                            <EditableText value={this.state.activePageName} 
                                        placeholder="Untitled Page" 
                                        onChange={(activePageName)=>this.setState({ activePageName })}
                                        onConfirm={this.handlePageNameChange}/>
                        </H4>
                    </div>
                    <MarkdownEditor markdown={this.state.activePageContent} 
                                    onChange={this.handleEdit}
                                    textareaRef={this.textareaRef}
                                    onPaste={this.handlePaste}/>
                </div>
                <Card style={{width: '40%', height: '100%', overflow: 'auto'}}>
                    <MarkdownRenderer markdown={this.state.activePageContent}/>
                </Card>
            </React.Fragment>
        )
    }

    getActivePage() {
        return this.props.notebook.pages.find(p => p._id === this.props.activePageId);
    }

    onClickSave() {
        this.props.onClickSave && this.props.onClickSave(this.props.notebook)
    }

    handleEdit(content) {
        this.setState({ activePageContent: content })
        this.props.handleEdit && this.props.handleEdit({ name: this.state.activePageNname, content })
    }

    handlePageNameChange(name) {
        this.setState({ activePageName: name })
        this.props.handleEdit && this.props.handleEdit({ name, content: this.state.activePagEcontent })
    }

    handleNotebookNameChange(name) {
        this.setState({ notebookName: name })
        this.props.renameNotebook(name)
    }

    onClickOpen() {
        this.setState({
            isOpenMenuOpen: true
        })
    }

    handlePaste(e) {
        // cancel default behavior and stop bubbling
        e.preventDefault();
        e.stopPropagation();
        let items = e.clipboardData.items
        for (var i = 0; i < items.length; i++) {
            let item = items[i]
            if (item.type.includes('image')) { // upload any image pasted
                const cursorLocation = this.textareaRef.current.selectionStart
                const blob = item.getAsFile()
                this.props.uploadImage(blob, cursorLocation)
            }
        }
    }
}