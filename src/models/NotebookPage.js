export default class NotebookPage {
    name = "Untitled";
    gistFilename = ""; // cached filename on gist, needed to rename pages
    content = "";
    deleted = false;

    static fromGistFile(gistFile) {
        return Object.assign(new NotebookPage(), {
            name: gistFile.filename.substring(0, gistFile.filename.lastIndexOf('.')),
            gistFilename: gistFile.filename,
            content: gistFile.content
        })
    }
}