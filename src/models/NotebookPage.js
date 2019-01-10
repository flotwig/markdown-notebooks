var idCounter = 0; // used to give each page a consistent internal ID for the session regardless of the page's origin (Gist vs. local)

/**
 * A single page of a Notebook.
 */
export default class NotebookPage {
    _id = 0;
    name = "Untitled";
    gistFilename = undefined; // cached filename of gistfile, needed to rename pages
    content = "";
    modified = false;

    constructor(name) {
        this._id = idCounter
        idCounter++
        this.name = name
    }

    /**
     * Formats the NotebookPage into a gistfile suitable for the GH API.
     * 
     * @param {string} filename The filename to add to the gistfile object.
     */
    toGistFile(filename) {
        return {
            content: this.content,
            filename
        }
    }

    /**
     * Given a gistfile from the GH API, return a matching NotebookPage.
     * 
     * @param {object} gistFile gistfile from GH API
     */
    static fromGistFile(gistFile) {
        let name = gistFile.filename
        if (/[1-9][0-9]*\..*\.md/g.test(name)) { // importing an existing notebookpage
            name = name.substring(name.indexOf('. ') + 2, name.lastIndexOf('.'))
        }
        return Object.assign(new NotebookPage(), {
            name,
            gistFilename: gistFile.filename,
            content: gistFile.content
        })
    }

    /**
     * Returns a copy of the NotebookPage with changes made.
     */
    withChanges(changes) {
        let modified = changes.modified || this.modified
        Object.keys(changes).forEach(key => {
            if (changes[key] !== this[key]) modified = true;
        })
        return Object.assign(new NotebookPage(), this, {
            modified,
            ...changes,
        })
    }
}