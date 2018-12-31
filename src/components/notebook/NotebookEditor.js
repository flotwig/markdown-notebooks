import React from 'react';
import PageEditor from './PageEditor';
import { Button, ButtonGroup, Divider } from '@blueprintjs/core';

export default class NotebookEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activePage: 0
        }
        this.onClickSave = this.onClickSave.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
    }

    render() {
        return (
            <div  style={{display: 'flex', width: '100%', height: '100%', margin: 0, padding: '1em'}}>
                <ButtonGroup alignText="right" minimal={true} vertical={true} style={{marginRight: '1em'}}>
                    <Button text="Save" icon="cloud-upload" onClick={this.onClickSave}/>
                    <Button text="Open" icon="cloud-download"/>
                    <Divider/>
                    <Button text="New Page"/>
                    <Button text="Delete Page"/>
                </ButtonGroup>
                <PageEditor page={this.props.notebook[this.state.activePage]}
                            handleEdit={this.handleEdit}/> 
            </div>
        )
    }

    onClickSave() {
        this.props.onClickSave && this.props.onClickSave(this.props.notebook)
    }

    handleEdit(page) {
        this.props.handleEdit && this.props.handleEdit(this.state.activePage, page)
    }
}