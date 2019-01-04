import NotebookPage from "./NotebookPage";
import moment from 'moment';

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

    static fromGistList(gistList) {
        return gistList.map(gist => Notebook.fromGist(gist))
    }

    toGist() {
        let files = {}
        const pages = this.pages.filter(p => p.content)
        pages.forEach(page => {
            let key = page.gistFilename || (page.name + '.md')
            if (page.deleted) {
                files[key] = null
            } else {
                files[key] = {
                    content: page.content,
                    filename: page.name + '.md'
                }
            }
        })
        return {
            description: this.name || 'Untitled Notebook',
            public: this.public,
            files
        }
    }

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
}