import React from 'react';
import Notebook from '../../models/Notebook';
import { Dialog, Button } from '@blueprintjs/core';

const dateFormat = "LLLL";

export default class DraftManager extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            newerDraftLocally: false,
            draft: undefined,
            dialogOpen: false
        }
    }

    componentDidUpdate(prevProps) {
        const { notebook } = this.props
        if (notebook) {
            if (!prevProps.notebook || prevProps.notebook.gistId !== notebook.gistId) {
                const draft = this.getDraft(notebook.gistId)
                if (draft && draft.updated_at.isAfter(notebook.updated_at)) {
                    this.setState({
                        newerDraftLocally: true,
                        dialogOpen: true,
                        draft
                    })
                }
            }
            if (notebook.modified) {
                this.saveDraft(notebook)
            }
        } else if(this.state.newerDraftLocally || this.state.dialogOpen) {
            this.setState({
                newerDraftLocally: false,
                dialogOpen: false
            })
        }
    }

    getKey = (gistId) => `draft.${gistId}`

    getDraft(gistId) {
        if (!gistId) return
        const json = localStorage.getItem(this.getKey(gistId))
        if (!json) return
        try {
            const draft = Notebook.fromJson(json)
            return draft
        } catch (e) {
            this.deleteDraft(gistId)
        }
    }

    deleteDraft(gistId) {
        localStorage.removeItem(this.getKey(gistId))
    }

    saveDraft(notebook) {
        localStorage.setItem(this.getKey(notebook.gistId), notebook.toJson())
    }

    restoreDraft(draft) {
        this.props.restoreDraft(draft)
        this.setState({
            newerDraftLocally: false,
        })
    }

    dismissDraft(draft) {
        this.setState({
            dialogOpen: false
        })
        this.deleteDraft(draft.gistId)
    }

    render() {
        const { draft } = this.state
        return (
            <>
                {this.state.newerDraftLocally && this.props.notebook &&
                    <Dialog onClose={()=>this.setState({ newerDraftLocally: false })}
                            isOpen={this.state.newerDraftLocally && this.state.dialogOpen} 
                            autoFocus enforceFocus 
                            isCloseButtonShown={false}
                            canEscapeKeyClose={false}
                            canOutsideClickClose={false}
                            title="Restore draft?">
                        <div className="bp3-dialog-body">
                            There is a newer auto-saved draft of your notebook stored locally than what was retrieved from GitHub.<br/>
                            <br/>
                            <strong>Your local draft</strong>: Updated on <strong>{draft.updated_at.format(dateFormat)}</strong><br/>
                            <strong>Remote copy</strong>: Updated on <strong>{this.props.notebook.updated_at.format(dateFormat)}</strong><br/>
                            <br/>
                            Would you like to continue working on your local draft, or would you like to discard your local changes and work from GitHub's copy?<br/>
                        </div>
                        <div className="bp3-dialog-footer">
                            <div className="bp3-dialog-footer-actions">
                                <Button intent="primary" onClick={()=>this.restoreDraft(draft)}>
                                    Continue from draft
                                </Button>
                                <Button intent="danger" onClick={()=>this.dismissDraft(draft)}>
                                    Discard local changes
                                </Button>
                            </div>
                        </div>
                    </Dialog>
                }
            </>
        )
    }
}