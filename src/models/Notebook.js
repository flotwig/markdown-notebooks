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
        const pages = this.pages.filter(p => p.content)
        pages.forEach(page => {
            let key = page.gistFilename || (page.name + '.md')
            files[key] = page.toGistFile()
        })
        return {
            description: this.name || 'Untitled Notebook',
            public: this.public,
            files
        }
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
}