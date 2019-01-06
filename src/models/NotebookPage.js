var idCounter = 0; // used to give each page a consistent internal ID for the session regardless of the page's origin (Gist vs. local)

/**
 * A single page of a Notebook.
 */
export default class NotebookPage {
    _id = 0;
    name = "Untitled";
    gistFilename = ""; // cached filename of gistfile, needed to rename pages
    content = "";

    constructor(name) {
        this._id = idCounter
        idCounter++
        this.name = name
    }

    /**
     * Formats the NotebookPage into a gistfile suitable for the GH API.
     */
    toGistFile() {
        return {
            content: this.content,
            filename: this.name + '.md'
        }
    }

    /**
     * Given a gistfile from the GH API, return a matching NotebookPage.
     * 
     * @param {object} gistFile gistfile from GH API
     */
    static fromGistFile(gistFile) {
        return Object.assign(new NotebookPage(), {
            name: gistFile.filename.substring(0, gistFile.filename.lastIndexOf('.')),
            gistFilename: gistFile.filename,
            content: gistFile.content
        })
    }
}