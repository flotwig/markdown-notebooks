import React from 'react';
import PageEditor from './PageEditor';
import ConnectedOpenMenu from './OpenMenu';
import PageList from './PageList';
import { Icon, Button, ButtonGroup, Divider, Dialog, NonIdealState, Spinner } from '@blueprintjs/core';

export default class NotebookEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpenMenuOpen: false
        }
        this.onClickSave = this.onClickSave.bind(this)
        this.onClickOpen = this.onClickOpen.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
    }

    render() {
        return (
            <React.Fragment>
                <Dialog isOpen={this.state.isOpenMenuOpen}>
                    <ConnectedOpenMenu closeMenu={()=>{this.setState({ isOpenMenuOpen: false })}}/>
                </Dialog>
                <div style={{display: 'flex', width: '100%', height: '100%', margin: 0, padding: '1em'}}>
                    <div style={{display: 'flex', flexDirection: 'column', marginRight: '1em'}}>
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
                                                          activePage={this.props.notebook.pages.find(p => p._id ===this.props.activePageId)} 
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
                <PageEditor page={this.props.notebook.pages.find(p => p._id === this.props.activePageId)}
                            handleEdit={this.handleEdit}/> 
        )
    }

    onClickSave() {
        this.props.onClickSave && this.props.onClickSave(this.props.notebook)
    }

    handleEdit(page) {
        this.props.handleEdit && this.props.handleEdit(page)
    }

    onClickOpen() {
        this.setState({
            isOpenMenuOpen: true
        })
    }
}