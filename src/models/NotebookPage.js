export default class NotebookPage {
    name = "Untitled";
    content = "";

    static fromGistFile(gistFile) {
        return Object.assign(new NotebookPage(), {
            name: gistFile.filename.substring(0, gistFile.filename.lastIndexOf('.')),
            content: gistFile.content
        })
    }
}