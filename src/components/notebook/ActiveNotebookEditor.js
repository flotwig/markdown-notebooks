import NotebookEditor from './NotebookEditor';
import { connect } from 'react-redux';
import { FETCH_SAVE, HANDLE_EDIT, ADD_PAGE, DELETE_PAGE, SET_ACTIVE_PAGE } from '../../state/notebookActions'

const ActiveNotebookEditor = connect(
    (state) => {
        return {
            ...state.notebook
        }
    }, (dispatch) => {
        return {
            onClickSave: notebook => dispatch(FETCH_SAVE(notebook)),
            handleEdit: (page) => dispatch(HANDLE_EDIT(page)),
            addPage: () => dispatch(ADD_PAGE()),
            deletePage: (page) => dispatch(DELETE_PAGE(page)),
            setActivePage: (page) => dispatch(SET_ACTIVE_PAGE(page))
        }
    }
)(NotebookEditor)

export default ActiveNotebookEditor;