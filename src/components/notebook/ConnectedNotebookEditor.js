import NotebookEditor from './NotebookEditor';
import { connect } from 'react-redux';
import {
    FETCH_SAVE, HANDLE_EDIT, ADD_PAGE, DELETE_PAGE, SET_ACTIVE_PAGE,
    UPLOAD_IMAGE, RENAME_NOTEBOOK, RENAME_PAGE, MOVE_PAGE_TO_INDEX,
    RESTORE_DRAFT, FETCH_NOTEBOOK, SET_ACTIVE_NOTEBOOK
} from '../../state/notebookActions'
import { getActivePage } from '../../state/notebookSelectors';
import { SET_PATHNAME } from '../../state/router';

const ConnectedNotebookEditor = connect(
    (state) => {
        return {
            ...state.notebook,
            activePage: getActivePage(state.notebook)
        }
    }, (dispatch) => {
        return {
            handleSave: (notebook, obj) => dispatch(FETCH_SAVE(notebook, obj)),
            handleEdit: (page) => dispatch(HANDLE_EDIT(page)),
            addPage: () => dispatch(ADD_PAGE()),
            deletePage: (page) => dispatch(DELETE_PAGE(page)),
            setActivePage: (page) => dispatch(SET_ACTIVE_PAGE(page)),
            uploadImage: (blob, cursorLocation) => dispatch(UPLOAD_IMAGE(blob, cursorLocation)),
            renameNotebook: (name) => dispatch(RENAME_NOTEBOOK(name)),
            renamePage: (name, page) => dispatch(RENAME_PAGE({ page, name })),
            movePageToIndex: (page, index) => dispatch(MOVE_PAGE_TO_INDEX({ page, index })),
            restoreDraft: (draft) => dispatch(RESTORE_DRAFT(draft)),
            fetchNotebook: (notebook) => dispatch(FETCH_NOTEBOOK(notebook)),
            setActiveNotebook: (notebook) => dispatch(SET_ACTIVE_NOTEBOOK(notebook)),
            setPathname: (pathname) => dispatch(SET_PATHNAME(pathname))
        }
    }
)(NotebookEditor)

export default ConnectedNotebookEditor;
