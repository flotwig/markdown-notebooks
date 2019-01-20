import React from 'react';

/**
 * Standalone editor for monospace text.
 */
export default class MarkdownEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deferredCursorLocation: undefined
        }
        this.textareaRef = React.createRef();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.markdown !== this.props.markdown && this.state.deferredCursorLocation) {
            this.setState({ deferredCursorLocation: undefined })
            const textarea = this.getTextarea()
            textarea.selectionStart = textarea.selectionEnd = this.state.deferredCursorLocation
        }
    }

    render() {
        // note: do not use blueprint3 TextArea - it does not implement all needed features like selectionStart, onPaste...
        return <textarea 
                className="bp3-input"
                style={{height: '100%', width: '100%', resize: 'none'}}
                placeholder="Begin typing here..."
                value={this.props.markdown} 
                ref={this.textareaRef}
                onChange={(e)=>this.handleChange(e)}
                onKeyDown={(e)=>this.handleKeyDown(e)}
                onPaste={(e)=>this.handlePaste(e)}/>
    }

    getTextarea() {
        return this.textareaRef.current
    }

    getCurrentLine() {
        const textarea = this.getTextarea()
        const cursorLocation = textarea.selectionStart
        let start = textarea.value.substring(0, cursorLocation).lastIndexOf('\n') + 1
        let end = textarea.value.substring(start).indexOf('\n')
        if (end === -1) end = textarea.value.length
        end += start
        return { start, end, cursor: cursorLocation - start, text: textarea.value.substring(start, end) }
    }

    handleChange(e) {
        let markdown = e.target.value;
        this.props.onChange(markdown)
    }

    handleKeyDown(e) {
        const textarea = this.getTextarea()
        console.log(e.nativeEvent)
        if (e.key === 'Tab') {
            // insert 4 spaces, if they're in a bulleted list then insert it at the front of the line
            const currentLine = this.getCurrentLine()
            const { text } = currentLine
            // https://github.github.com/gfm/#bullet-list-marker
            const newCurrentLineText = /^\s*[-+*] /.test(text)
                ? '    ' + text 
                : text.substring(0, currentLine.cursor) + '    ' + text.substring(currentLine.cursor);
            const markdown = textarea.value.substring(0, currentLine.start) + newCurrentLineText;
            this.setState({ deferredCursorLocation: markdown.length })
            this.props.onChange(markdown + textarea.value.substring(currentLine.end))
            e.preventDefault()
        } else if (e.key === 'Enter') {
            // if they're in a bulleted list, insert a new line with their bullet
            const currentLine = this.getCurrentLine()
            const bulleted = /^\s*([-+*]) /.exec(currentLine.text)
            if (bulleted !== null) {
                const markdown = textarea.value.substring(0, currentLine.end) + '\n' + bulleted[0]
                this.setState({ deferredCursorLocation: markdown.length })
                this.props.onChange(markdown +  textarea.value.substring(currentLine.end))
                e.preventDefault()
            }
        }
    }

    handlePaste(e) {
        let items = e.clipboardData.items
        for (var i = 0; i < items.length; i++) {
            let item = items[i]
            if (item.type.includes('image')) { // upload any image pasted
                // cancel default behavior
                e.preventDefault();
                const cursorLocation = this.getTextarea().selectionStart
                const blob = item.getAsFile()
                this.props.uploadImage(blob, cursorLocation)
            }
        }
    }
}