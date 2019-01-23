import React from 'react';
import MarkdownEditor from '../markdown/MarkdownEditor';
import MarkdownRenderer from '../markdown/MarkdownRenderer';
import ConnectedOpenMenu from './OpenMenu';
import PageList from './PageList';
import DraftManager from './DraftManager';
import LogoLockup from '../LogoLockup';
import { 
    Button, ButtonGroup, Divider, Dialog, Tag,
    NonIdealState, Spinner, H2, H4, EditableText, Card
} from '@blueprintjs/core';
import Notebook from '../../models/Notebook';

/**
 * Editor pane for a notebook. Includes all the needed controls.
 */
export default class NotebookEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpenMenuOpen: false,
        }
        this.componentDidUpdate({}, {}, {})
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleOpen = this.handleOpen.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleNotebookNameChange = this.handleNotebookNameChange.bind(this)
    }

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown)
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { notebook } = this.props // shortcut
        if (notebook) {
            const title = (notebook.modified ? '* ' : '') + notebook.name
            if (title !== document.title) {
                document.title = title
            }
            if (!prevProps.notebook || notebook.isSaveable() !== prevProps.notebook.isSaveable()) {
                this.setState({
                    saveDisabled: !notebook.isSaveable()
                })
            }
            if (!prevProps.activePage || prevProps.activePage.name !== this.props.activePage.name) {
                this.setState({
                    activePageName: this.props.activePage.name
                })
            }
            if (!prevProps.notebook || prevProps.notebook.name !== notebook.name) {
                this.setState({
                    notebookName: notebook.name
                })
            }
        }
    }

    render() {
        return (
            <>
                <DraftManager restoreDraft={this.props.restoreDraft} 
                              notebook={this.props.notebook}
                              fetchNotebook={this.props.fetchNotebook}/>
                <Dialog onClose={()=>this.setState({ isOpenMenuOpen: false })}
                        isOpen={this.state.isOpenMenuOpen} 
                        title="Open a notebook">
                    <ConnectedOpenMenu closeMenu={()=>{this.setState({ isOpenMenuOpen: false })}}/>
                </Dialog>
                <div style={{display: 'flex', width: '100%', height: '100%', margin: 0, padding: '1em'}}>
                    {this.renderSidebar()}
                    {this.props.isLoadingNotebook ? this.renderLoading() : (!this.props.notebook ? this.renderNoNotebook() : this.renderEditor())}
                </div>
            </>
        )
    }

    renderSidebar() {
        return (
            <div style={{display: 'flex', width: '10%', flexDirection: 'column', marginRight: '1em'}}>
                <LogoLockup/>
                <ButtonGroup alignText="right" minimal={true} vertical={true}>
                    {this.props.saveError &&
                        <Tag icon="warning-sign" intent="danger" large>Error While Saving</Tag>}
                    {this.props.notebook && this.props.notebook.modified ? 
                        <Tag icon="warning-sign" intent="warning" large>Unsaved Changes</Tag>
                    :
                        <Tag icon="thumbs-up" intent="success" large>No Unsaved Changes</Tag>}
                    <Button text="New Notebook" onClick={()=>this.handleNew()}/>
                    <Button text="Save Notebook" onClick={this.handleSave} loading={this.props.isSaving} disabled={this.props.isSaving || this.state.saveDisabled}/>
                    <Button text="Open Notebook" onClick={this.handleOpen}/>
                    {this.props.notebook &&
                        <>
                            <Divider/>
                            <Button text="New Page" onClick={()=>this.props.addPage()}/>
                            <Button text="Delete Page" onClick={()=>this.props.deletePage()}/>
                            <Divider/>
                        </>
                    }
                </ButtonGroup>
                {this.props.notebook && <PageList pages={this.props.notebook.pages} 
                                                    movePageToIndex={this.props.movePageToIndex}
                                                    activePage={this.props.activePage} 
                                                    onClickPage={this.props.setActivePage}/>
                }
            </div>
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
            <>
                <div style={{width: '50%', flex: 'auto', display: 'flex', flexDirection: 'column', marginRight: '1%'}}>
                    <div style={{maxWidth: '100%'}}>
                        <H2>
                            <EditableText value={this.state.notebookName} 
                                        placeholder="Untitled Page" 
                                        onChange={(notebookName)=>this.setState({ notebookName })}
                                        onConfirm={(name) => this.props.renameNotebook(name)}/>
                        </H2>
                        <H4>
                            <EditableText value={this.state.activePageName} 
                                        placeholder="Untitled Page" 
                                        onChange={(activePageName)=>this.setState({ activePageName })}
                                        onConfirm={(name) => this.props.renamePage(name)}/>
                        </H4>
                    </div>
                    <MarkdownEditor markdown={this.props.activePage.content} 
                                    onChange={this.handleEdit}
                                    uploadImage={this.props.uploadImage}/>
                </div>
                <Card style={{width: '40%', height: '100%', overflow: 'auto'}}>
                    <MarkdownRenderer markdown={this.props.activePage.content}/>
                </Card>
            </>
        )
    }

    handleKeyDown(e) {
        if (e.ctrlKey && e.key.toLowerCase() === 's') { // Ctrl+S
            this.handleSave()
            e.preventDefault()
        } else if (e.ctrlKey && e.key.toLowerCase() === 'o') {
            this.handleOpen()
            e.preventDefault()
        }
    }

    handleNew() {
        this.props.setActiveNotebook(new Notebook())
    }

    handleSave() {
        if (this.state.saveDisabled) return
        this.props.handleSave(this.props.notebook)
    }

    handleEdit(content) {
        this.props.handleEdit({ name: this.state.activePageName, content })
    }

    handleNotebookNameChange(name) {
        this.setState({ notebookName: name })
        this.props.renameNotebook(name)
    }

    handleOpen() {
        this.setState({
            isOpenMenuOpen: true
        })
    }
}