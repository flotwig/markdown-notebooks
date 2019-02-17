import React from 'react';
import Draft from '../../models/Draft';
import { Dialog, Button } from '@blueprintjs/core';

const dateFormat = "LLLL";

export default class DraftManager extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            newerDraftLocally: false,
            draft: undefined,
            dialogOpen: false,
            lastNotebook: undefined
        }
    }

    componentDidMount() {
        if (this.props.isLoadingNotebook) return;
        const lastGist = this.getLastGist()
        if (!lastGist) return;
        const { lastGistId, lastGistOwnerLogin } = lastGist
        const lastOpenDraft = this.getDraft(lastGistId)
        if (lastOpenDraft) {
            this.restoreDraft(lastOpenDraft)
        } else if (lastGistId) {
            // we can load it from github then
            this.props.setPathname(`/${lastGistOwnerLogin}/${lastGistId}`)
        }
    }

    componentDidUpdate(prevProps) {
        const { notebook } = this.props
        if (notebook) {
            if ((!prevProps.notebook && notebook) || (prevProps.notebook.gistId !== notebook.gistId)) {
                this.saveLastGist(notebook.gistId, notebook.gistOwnerLogin)
                const draft = this.getDraft(notebook.gistId)
                if (draft && draft.notebook.updated_at.isAfter(notebook.updated_at)) {
                    this.setState({
                        newerDraftLocally: true,
                        dialogOpen: true,
                        draft
                    })
                }
            }
            if (notebook.modified || (prevProps.activePageId && this.props.activePageId !== prevProps.activePageId)) {
                this.saveDraft(new Draft({
                    notebook,
                    activePageId: this.props.activePageId
                }))
            } else {
                this.deleteDraft(notebook.gistId)
            }
        } else if(this.state.newerDraftLocally || this.state.dialogOpen) {
            this.setState({
                newerDraftLocally: false,
                dialogOpen: false
            })
        }
    }

    saveLastGist(gistId, gistOwnerLogin) {
        localStorage.setItem('lastGist', JSON.stringify({ gistId, gistOwnerLogin }))
    }

    getLastGist() {
        try {
            return JSON.parse(localStorage.getItem('lastGist'))
        } catch (e) {
            localStorage.removeItem('lastGist')
        }
    }

    getKey = (gistId) => `draft.${gistId || '__unsaved'}`

    getDraft(gistId) {
        const json = localStorage.getItem(this.getKey(gistId))
        if (!json) return
        try {
            return new Draft(JSON.parse(json))
        } catch (e) {
            this.deleteDraft(gistId)
        }
    }

    deleteDraft(gistId) {
        localStorage.removeItem(this.getKey(gistId))
    }

    saveDraft(draft) {
        localStorage.setItem(this.getKey(draft.notebook.gistId), draft.toJson())
    }

    restoreDraft(draft) {
        this.props.restoreDraft(draft)
        this.setState({
            newerDraftLocally: false,
        })
        if (draft.notebook.gistId)
            this.props.setPathname(`/${draft.notebook.gistOwnerLogin}/${draft.notebook.gistId}`)
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
                            className="dialog-draft"
                            title="Restore draft?">
                        <div className="bp3-dialog-body">
                            There is a newer auto-saved draft of your notebook stored locally than what was retrieved from GitHub.<br/>
                            <br/>
                            <strong>Your local draft</strong>: Updated on <strong>{draft.notebook.updated_at.format(dateFormat)}</strong><br/>
                            <strong>Remote copy</strong>: Updated on <strong>{this.props.notebook.updated_at.format(dateFormat)}</strong><br/>
                            <br/>
                            Would you like to continue working on your local draft, or would you like to discard your local changes and work from GitHub's copy?<br/>
                        </div>
                        <div className="bp3-dialog-footer">
                            <div className="bp3-dialog-footer-actions">
                                <Button intent="primary" onClick={()=>this.restoreDraft(draft)} className="btn-restore-draft">
                                    Continue from draft
                                </Button>
                                <Button intent="danger" onClick={()=>this.dismissDraft(draft)} className="btn-discard-draft">
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
