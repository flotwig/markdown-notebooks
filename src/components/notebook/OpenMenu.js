import { FETCH_NOTEBOOKS, FETCH_NOTEBOOK } from "../../state/notebookActions";
import { HTMLTable, NonIdealState, Spinner, Button } from '@blueprintjs/core';
import React from 'react';
import { connect } from 'react-redux';

/**
 * Component for showing a user's existing Gists. Allows them to open any one
 * as a notebook.
 */
export class OpenMenu extends React.Component {
    componentDidMount() {
        this.props.fetchNotebooks()
    }

    render() {
        return (
            <div className="bp3-dialog-body">
                {this.props.isLoadingNotebookList ?
                    <NonIdealState icon={<Spinner/>} description="Loading notebooks..."/>
                :
                    this.renderList()
                }
            </div>
        )
    }

    renderList() {
        return (
            <HTMLTable bordered interactive>
                <thead>
                    <tr>
                        <th>
                            Name
                        </th>
                        <th>
                            Pages
                        </th>
                        <th style={{width: '120px'}}>
                            Modified
                        </th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.notebookList.map(notebook => (
                        <tr key={notebook.gistId} onClick={()=>this.onClickOpen(notebook)}>
                            <td>
                                {notebook.name}
                            </td>
                            <td>
                                {notebook.pages.length}
                            </td>
                            <td>
                                {notebook.updated_at.fromNow()}
                            </td>
                            <td>
                                <Button>
                                    Open
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </HTMLTable>
        )
    }

    onClickOpen(notebook) {
        this.props.fetchNotebook(notebook)
        this.props.closeMenu()
    }
}

const ConnectedOpenMenu = connect(
    (state) => {
        return {
            isLoadingNotebookList: state.notebook.isLoadingNotebookList,
            isLoadingNotebook: state.notebook.isLoadingNotebook,
            notebookList: state.notebook.notebookList
        }
    },
    (dispatch) => {
        return {
            fetchNotebooks: () => dispatch(FETCH_NOTEBOOKS()),
            fetchNotebook: (notebook) => dispatch(FETCH_NOTEBOOK(notebook))
        }
    }
)(OpenMenu);

export default ConnectedOpenMenu;