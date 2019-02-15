import Notebook from './Notebook'

export default class Draft {
    constructor(draft) {
        if (!draft.notebook) {
            throw new Error('Draft must have a notebook')
        }
        this.notebook = new Notebook(draft.notebook)
        this.cursorLocation = draft.cursorLocation
        this.activePageId = draft.activePageId
    }

    toJson() {
        return JSON.stringify(this)
    }

    static fromJson(json) {
        return new this(JSON.parse(json))
    }
}
