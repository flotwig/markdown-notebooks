var idCounter = 0; // used to give each page a consistent internal ID for the session regardless of the page's origin (Gist vs. local)

export default class NotebookPage {
    _id = 0;
    name = "Untitled";
    gistFilename = ""; // cached filename of gistfile, needed to rename pages
    content = "";
    deleted = false;

    constructor(name) {
        this._id = idCounter
        idCounter++
        this.name = name
    }

    static fromGistFile(gistFile) {
        return Object.assign(new NotebookPage(), {
            name: gistFile.filename.substring(0, gistFile.filename.lastIndexOf('.')),
            gistFilename: gistFile.filename,
            content: gistFile.content
        })
    }
}