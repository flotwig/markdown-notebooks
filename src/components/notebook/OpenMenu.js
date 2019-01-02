import { FETCH_NOTEBOOKS } from "../../state/notebookActions";
import { HTMLTable, NonIdealState, Spinner, Button } from '@blueprintjs/core';
import React from 'react';
import { connect } from 'react-redux';

export class OpenMenu extends React.Component {
    componentDidMount() {
        this.props.fetchNotebooks && this.props.fetchNotebooks()
    }

    render() {
        if (this.props.isLoadingNotebookList) {
            return <NonIdealState icon={<Spinner/>} description="Loading notebooks..."/>
        } else {
            return this.renderList()
        }
    }

    renderList() {
        return (
            <React.Fragment>
                <div className="bp3-dialog-header">
                    <h4 className="bp3-heading">Open a notebook</h4>
                </div>
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
                            <tr key={notebook.gistId}>
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
                                    <Button onClick={()=>this.onClickOpen(notebook)}>
                                        Open
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </HTMLTable>
            </React.Fragment>
        )
    }

    onClickOpen(notebook) {

    }
}

const ConnectedOpenMenu = connect(
    (state) => {
        return {
            isLoadingNotebookList: state.notebook.isLoadingNotebookList,
            notebookList: state.notebook.notebookList
        }
    },
    (dispatch) => {
        return {
            fetchNotebooks: () => dispatch(FETCH_NOTEBOOKS())
        }
    }
)(OpenMenu);

export default ConnectedOpenMenu;