import NotebookEditor from './NotebookEditor';
import { connect } from 'react-redux';
import { FETCH_SAVE, HANDLE_EDIT } from '../../state/notebookActions'

const ActiveNotebookEditor = connect(
    (state) => {
        return {
            ...state.notebook
        }
    }, (dispatch) => {
        return {
            onClickSave: notebook => dispatch(FETCH_SAVE(notebook)),
            handleEdit: (activePage, page) => dispatch(HANDLE_EDIT({ activePage, page }))
        }
    }
)(NotebookEditor)

export default ActiveNotebookEditor;