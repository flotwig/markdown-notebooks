import React from 'react';
import PageEditor from './PageEditor';
import { Button, ButtonGroup, Divider } from '@blueprintjs/core';

export default class NotebookEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activePage: this.props.notebook.pages[0]
        }
    }

    render() {
        return (
            <div  style={{display: 'flex', width: '100%', height: '100%', margin: 0, padding: '1em'}}>
                <ButtonGroup alignText="right" minimal={true} vertical={true} style={{marginRight: '1em'}}>
                    <Button text="Save" icon="cloud-upload"/>
                    <Button text="Open" icon="cloud-download"/>
                    <Divider/>
                    <Button text="New Page"/>
                    <Button text="Delete Page"/>
                </ButtonGroup>
                <PageEditor page={this.state.activePage}/>
            </div>
        )
    }
}