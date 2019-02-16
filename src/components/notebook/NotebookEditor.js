import React from 'react';
import MarkdownEditor from '../markdown/MarkdownEditor';
import MarkdownRenderer from '../markdown/MarkdownRenderer';
import ConnectedOpenMenu from './OpenMenu';
import PageList from './PageList';
import DraftManager from './DraftManager';
import SplitPane from 'react-split-pane/lib/SplitPane'
import Pane from 'react-split-pane/lib/Pane'
import {
    Icon, Dialog, Tag, Menu,
    NonIdealState, Spinner, H2, H4, EditableText, Card, Navbar, Alignment, MenuItem
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
            saveDisabled: true
        }
        this.componentDidUpdate({}, {}, {})
        this._handleKeyDown = this._handleKeyDown.bind(this)
        this._handleSave = this._handleSave.bind(this)
        this._handleOpen = this._handleOpen.bind(this)
        this._handleEdit = this._handleEdit.bind(this)
        this._handleNotebookNameChange = this._handleNotebookNameChange.bind(this)
    }

    componentDidMount() {
        window.addEventListener('keydown', this._handleKeyDown)
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this._handleKeyDown)
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
                {this._renderDraftManager()}
                {this._renderOpenDialog()}
                <div style={{display: 'flex', flexDirection: 'column', height: '100%', width: '100%'}}>
                    {this._renderNavbar()}
                    <SplitPane split="vertical">
                        <Pane initialSize="150px" minSize="50px">{this._renderSidebar()}</Pane>
                        <Pane minSize="80px">{this._renderEditor()}</Pane>
                        <Pane minSize="50px">{this._renderMarkdown()}</Pane>
                    </SplitPane>
                </div>
            </>
        )
    }

    _renderNavbar() {
        return (
            <Navbar fixedToTop className="bp3-dark">
                <Navbar.Group align={Alignment.LEFT}>
                    <Navbar.Heading><Icon icon="book"/> Markdown Notebooks</Navbar.Heading>
                    {/* <Popover
                        inheritDarkTheme={false}
                        enforceFocus={false}
                        content={(
                            <Menu>
                            </Menu>
                        )}
                        >
                        <Button minimal icon="book" text="Notebook" rightIcon="caret-down" className="btn-notebook"/>
                    </Popover> */}
                    {this._renderStatusIndicator()}
                </Navbar.Group>
                <Navbar.Group align={Alignment.RIGHT}>

                </Navbar.Group>
            </Navbar>
        )
    }

    _renderStatusIndicator() {
        if (this.props.isSaving) {
            return <Tag icon={<Spinner/>} className="tag-is-saving" intent="primary" large>Saving...</Tag>
        }
        if (this.props.saveError) {
            return <Tag icon="warning-sign" className="tag-error-saving" intent="danger" large>Error While Saving</Tag>
        }
        if (this.props.notebook && this.props.notebook.modified) {
            return <Tag icon="warning-sign" className="tag-unsaved-changes" intent="warning" large>Unsaved Changes</Tag>
        }
        return <Tag icon="thumbs-up" className="tag-no-unsaved-changes" intent="success" large>No Unsaved Changes</Tag>
    }

    _renderSidebar() {
        return (
            <Menu className="menu-sidebar">
                <MenuItem onClick={() => this._handleNew()} icon="plus" text="New Notebook" className="btn-new-notebook"/>
                <MenuItem onClick={() => this._handleSave()} icon="upload" text="Save Notebook" className="btn-save-notebook" disabled={this.props.isSaving || this.state.saveDisabled}/>
                <MenuItem onClick={() => this._handleOpen()} icon="download" text="Open Notebook" className="btn-open-notebook"/>
                <Menu.Divider/>
                {this.props.notebook && <PageList pages={this.props.notebook.pages}
                                                  movePageToIndex={this.props.movePageToIndex}
                                                  activePage={this.props.activePage}
                                                  onClickPage={this.props.setActivePage}
                                                  addPage={this.props.addPage}
                                                  deletePage={this.props.deletePage}
                                                  />
                }
            </Menu>
        )
    }

    _renderOpenDialog() {
        return (
            <Dialog onClose={()=>this.setState({ isOpenMenuOpen: false })}
                    isOpen={this.state.isOpenMenuOpen}
                    title="Open a notebook"
                    >
                <ConnectedOpenMenu closeMenu={()=>{this.setState({ isOpenMenuOpen: false })}}/>
            </Dialog>
        )
    }

    _renderDraftManager() {
        return (
            <DraftManager restoreDraft={this.props.restoreDraft}
                        notebook={this.props.notebook}
                        activePageId={this.props.activePageId}
                        fetchNotebook={this.props.fetchNotebook}
                        />
        )
    }

    _renderLoading() {
        return <NonIdealState icon={<Spinner/>} className="nis-loading-notebook" description="Loading notebook..."/>
    }

    _renderNoNotebook() {
        return <NonIdealState icon="clean" className="nis-no-notebook" description="Open a notebook to start editing."/>
    }

    _renderEditor() {
        if (this.props.isLoadingNotebook) {
            return this._renderLoading()
        }
        if (!this.props.notebook) {
            return this._renderNoNotebook()
        }
        return (
            <div style={{display: 'flex', flexDirection: 'column', padding: '1em', height: '100%'}}>
                <div style={{maxWidth: '100%'}}>
                    <H2 className="h-notebook-name">
                        <EditableText value={this.state.notebookName}
                                    placeholder="Untitled Page"
                                    onChange={(notebookName)=>this.setState({ notebookName })}
                                    onConfirm={(name) => this.props.renameNotebook(name)}/>
                    </H2>
                    <H4 className="h-page-name">
                        <EditableText value={this.state.activePageName}
                                    placeholder="Untitled Page"
                                    onChange={(activePageName)=>this.setState({ activePageName })}
                                    onConfirm={(name) => this.props.renamePage(name)}/>
                    </H4>
                </div>
                <MarkdownEditor markdown={this.props.activePage.content}
                                onChange={this._handleEdit}
                                uploadImage={this.props.uploadImage}/>
            </div>
        )
    }

    _renderMarkdown() {
        if (!this.props.notebook) {
            return <div/>
        }
        return (
            <div style={{ padding: '1em', height: '100%'}}>
                <Card style={{overflow: 'auto', height: '100%'}}>
                    <MarkdownRenderer markdown={this.props.activePage.content}
                                    onCheckboxToggle={(checkboxIndex, value) => this._handleCheckboxToggle(checkboxIndex, value)}/>
                </Card>
            </div>
        )
    }

    _handleCheckboxToggle(checkboxIndex, value) {
        const r = /^(\s*[-+*]\s+\[)([ xX])(\])/gm
        var i = 0;
        const markdown = this.props.activePage.content.replace(
            r, (match) => {
                i++
                if (i-1 !== checkboxIndex) {
                    return match
                }
                return match.replace(r, `$1${value ? 'x' : ' '}$3`)
            }
        )
        this._handleEdit(markdown)
    }

    _handleKeyDown(e) {
        if (e.ctrlKey && e.key.toLowerCase() === 's') { // Ctrl+S
            this._handleSave()
            e.preventDefault()
        } else if (e.ctrlKey && e.key.toLowerCase() === 'o') {
            this._handleOpen()
            e.preventDefault()
        }
    }

    _handleNew() {
        this.props.setActiveNotebook(new Notebook())
    }

    _handleSave() {
        if (this.state.saveDisabled) return
        this.props.handleSave(this.props.notebook)
    }

    _handleEdit(content) {
        this.props.handleEdit({ name: this.state.activePageName, content })
    }

    _handleNotebookNameChange(name) {
        this.setState({ notebookName: name })
        this.props.renameNotebook(name)
    }

    _handleOpen() {
        this.setState({
            isOpenMenuOpen: true
        })
    }
}
