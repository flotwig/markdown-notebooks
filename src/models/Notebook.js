import NotebookPage from "./NotebookPage";
import moment from 'moment';
import leftPad from 'left-pad';

const hydratePages = (pages) => {
    if (pages) {
        return pages.map(page => Object.assign(new NotebookPage(), page))
    }
}

const hydrateDate = (date) => {
    if (date) {
        return moment(date)
    }
}

/**
 * A Notebook is the top-level document in Markdown Notebooks. It contains a set of NotebookPages
 * which contain the actual content.
 */
export default class Notebook {
    modified = false; // has it been modified since being loaded/created?
    public = false;
    created_at = moment();
    updated_at = undefined;
    saved_at = undefined;
    gistId = ''; // if empty, has never been saved to Gist
    gistOwnerLogin = ''; // GitHub username
    name = 'Untitled Notebook'; // description on Gist
    pages = [new NotebookPage('Untitled Page')]; // array of pages
    deletedPages = []; // list of deleted pages - needed to delete from Gist

    constructor(notebook) {
        if (notebook) {
            Object.assign(this, notebook, {
                pages: hydratePages(notebook.pages),
                deletedPages: hydratePages(notebook.deletedPages),
                updated_at: hydrateDate(notebook.updated_at),
                saved_at: hydrateDate(notebook.saved_at),
                created_at: hydrateDate(notebook.created_at)
            })
        }
    }

    /**
     * From a GitHub Gist, generate a matching Notebook.
     *
     * @param {object} gist gist object from GH API
     */
    static fromGist(gist) {
        return Object.assign(new Notebook(), {
            public: gist.public,
            created_at: moment(gist.created_at),
            updated_at: moment(gist.updated_at),
            saved_at: moment(gist.updated_at),
            gistId: gist.id,
            gistOwnerLogin: gist.owner.login,
            name: gist.description,
            pages: Object.keys(gist.files).map(filename => {
                let file = gist.files[filename];
                return NotebookPage.fromGistFile(file);
            })
        })
    }

    /**
     * Generates an array of Notebooks from a list of Gists. Works with partial Gist objects.
     *
     * @param {object[]} gistList list of gist objects from GH API
     */
    static fromGistList(gistList) {
        return gistList.map(gist => Notebook.fromGist(gist))
    }

    /**
     * Formats the Notebook into a Gist object suitable for the GH API.
     */
    toGist() {
        let files = {}
        const pages = this.pages.filter(p => p.content) // gist does not accept empty files, TODO: consider giving feedback to user
        const digits = Math.ceil(Math.log10(pages.length))
        const getPageNumber = (i) => {
            return leftPad(i, digits, 0)
        }
        pages.forEach((page, i) => {
            const filename = `${getPageNumber(i+1)}. ${page.name}.md`
            const key = page.gistFilename || filename
            files[key] = page.toGistFile(filename)
        })
        this.deletedPages.filter(page => page.gistFilename).forEach(page => {
            files[page.gistFilename] = null
        })
        return {
            description: this.name || 'Untitled Notebook',
            public: this.public,
            files
        }
    }

    static fromJson(json) {
        const parsedJson = JSON.parse(json)
        return new Notebook(parsedJson)
    }

    toJson() {
        return JSON.stringify(this)
    }

    /**
     * Finds an unused page name beginning with `stub`.
     *
     * @param {string} stub Default page name. Defaults to 'Untitled Page'.
     * @param {NotebookPage} ignore Page to ignore while scanning.
     */
    getUnusedName(stub, ignore) {
        stub = stub || 'Untitled Page'
        let name = stub
        let i = 0
        const predicate = page => (page.name === name && (!ignore || ignore._id !== page._id))
        while (this.pages.find(predicate)) {
            i++
            name = stub + " (" + i + ")"
        }
        return name
    }

    /**
     * Returns true if the notebook has enough content to be saved.
     */
    isSaveable() {
        for (let i = 0; i < this.pages.length; i++) {
            if (this.pages[i].content.length > 0) {
                return true
            }
        }
        return false
    }

    /**
     * Returns a copy of the Notebook with changes made.
     */
    withChanges(changes) {
        let modified = changes.modified || this.modified
        Object.keys(changes).forEach(key => {
            if (changes[key] !== this[key]) modified = true;
        })
        return Object.assign(new Notebook(), this, {
            modified,
            updated_at: modified ? moment() : this.updated_at,
            ...changes,
        })
    }
}
