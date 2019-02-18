import { FETCH_NOTEBOOKS } from '../../state/notebookActions'
import { HTMLTable, NonIdealState, Spinner } from '@blueprintjs/core'
import React from 'react'
import { connect } from 'react-redux'
import { SET_PATHNAME } from '../../state/router';

/**
 * Component for showing a user's existing Gists. Allows them to open any one
 * as a notebook.
 */
export class OpenMenu extends React.Component {
    componentDidMount() {
        this.props.fetchNotebooks()
    }

    render() {
        if (this.props.isLoadingNotebookList) {
            return (
                <NonIdealState className="bp3-dialog-body" icon={<Spinner/>} description="Loading notebooks..."/>
            )
        }
        return this._renderList()
    }

    _renderList() {
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
                        </tr>
                    ))}
                </tbody>
            </HTMLTable>
        )
    }

    onClickOpen(notebook) {
        this.props.setPathname(`/${notebook.gistOwnerLogin}/${notebook.gistId}`)
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
            setPathname: (pathname) => dispatch(SET_PATHNAME(pathname))
        }
    }
)(OpenMenu)

export default ConnectedOpenMenu;
