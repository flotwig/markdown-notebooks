import NotebookPage from "./NotebookPage";
import moment from 'moment';

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
        pages.forEach((page, i) => {
            const filename = `${i+1}. ${page.name}.md`
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
        return Object.assign(new Notebook(), parsedJson, {
            pages: parsedJson.pages.map(page => Object.assign(new NotebookPage(), page)),
            deletedPages: parsedJson.deletedPages.map(page => Object.assign(new NotebookPage(), page)),
            updated_at: parsedJson.updated_at ? moment(parsedJson.updated_at) : undefined,
            saved_at: parsedJson.saved_at ? moment(parsedJson.saved_at) : undefined,
            created_at: parsedJson.created_at ? moment(parsedJson.created_at) : undefined
        })
    }

    toJson() {
        return JSON.stringify(this)
    }

    /**
     * Finds an unused page name beginning with `stub`.
     * 
     * @param {string} stub Default page name. Defaults to 'Untitled Page'.
     */
    getUnusedName(stub) {
        stub = stub || 'Untitled Page'
        let name = stub
        let i = 0
        const predicate = page => page.name === name
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