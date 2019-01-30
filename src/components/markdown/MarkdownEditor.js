import React from 'react';

/**
 * Standalone editor for monospace text.
 */
export default class MarkdownEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deferredCursorLocation: undefined,
            showDragOverlay: false
        }
        this.textareaRef = React.createRef();
        console.log(this.textareaRef)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.markdown !== this.props.markdown && this.state.deferredCursorLocation) {
            this.setState({ deferredCursorLocation: undefined })
            const textarea = this.getTextarea()
            textarea.selectionStart = textarea.selectionEnd = this.state.deferredCursorLocation
        }
    }

    render() {
        console.log(this.textareaRef)
        // note: do not use blueprint3 TextArea - it does not implement all needed features like selectionStart, onPaste...
        return (
            <div style={{height: '100%', width: '100%', position: 'relative'}}>
                {this.state.showDragOverlay && 
                    <div 
                        style={{position: 'absolute', width: '100%', height: '100%', fontSize: '2em', fontWeight: 800, backgroundColor: 'rgba(0,0,0,.3)', paddingTop: '40%', textAlign: 'center'}}
                        onDragOver={(e)=>this.handleDragOver(e)}
                        onDragEnd={(e)=>this.handleDragEnd(e)}
                        onDrop={(e)=>this.handleDrop(e)}
                        >
                        Drop your image here!
                    </div>
                }
                <textarea 
                    className="bp3-input markdown-textarea"
                    style={{height: '100%', width: '100%', resize: 'none'}}
                    placeholder="Begin typing here..."
                    value={this.props.markdown} 
                    disabled={this.props.disabled}
                    ref={this.textareaRef}
                    onDragOver={(e)=>this.handleDragOver(e)}
                    onDragEnd={(e)=>this.handleDragEnd(e)}
                    onDrop={(e)=>this.handleDrop(e)}
                    onChange={(e)=>this.handleChange(e)}
                    onKeyDown={(e)=>this.handleKeyDown(e)}
                    onPaste={(e)=>this.handlePaste(e)}
                    />
            </div>
        )
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

    queueImageInsert(item) {
        const blob = item.getAsFile()
        const cursorLocation = this.getTextarea().selectionStart
        this.props.uploadImage(blob, cursorLocation)
    }

    handleChange(e) {
        let markdown = e.target.value;
        this.props.onChange(markdown)
    }

    handleKeyDown(e) {
        const textarea = this.getTextarea()
        console.log(e.nativeEvent)
        if (e.key === 'Tab') {
            const currentLine = this.getCurrentLine()
            const { text } = currentLine
            let newCurrentLineText;
            if (e.shiftKey) {
                // slide backwards 4 spaces/to front of line if it's indented
                newCurrentLineText = text.replace(/^([ ]{1,4}|\t)/, '')
            } else {
                // insert 4 spaces, if they're in a bulleted list then insert it at the front of the line
                // https://github.github.com/gfm/#bullet-list-marker
                newCurrentLineText = /^\s*[-+*] /.test(text)
                    ? '    ' + text 
                    : text.substring(0, currentLine.cursor) + '    ' + text.substring(currentLine.cursor);
            }
            const markdown = textarea.value.substring(0, currentLine.start) + newCurrentLineText;
            this.setState({ deferredCursorLocation: markdown.length })
            this.props.onChange(markdown + textarea.value.substring(currentLine.end))
            e.preventDefault()
        } else if (e.key === 'Enter') {
            const currentLine = this.getCurrentLine()
            // if they're pressing Enter on an empty bullet, delete that bullet
            if (/^\s*([-+*])\s*$/.test(currentLine.text)) {
                const markdown = textarea.value.substring(0, currentLine.start);
                this.setState({ deferredCursorLocation: markdown.length })
                this.props.onChange(markdown + textarea.value.substring(currentLine.end))
                e.preventDefault()
            } else {
                const bulleted = /^\s*([-+*]) /.exec(currentLine.text)
                if (bulleted !== null) {
                    // if they're in a bulleted list, insert a new line with their bullet
                    const split = textarea.selectionStart
                    const markdown = textarea.value.substring(0, split) + '\n' + bulleted[0]
                    this.setState({ deferredCursorLocation: markdown.length })
                    this.props.onChange(markdown + textarea.value.substring(split))
                    e.preventDefault()
                }
            }
        }
    }

    handlePaste(e) {
        const items = e.clipboardData.items
        for (var i = 0; i < items.length; i++) {
            const item = items[i]
            if (item.type.includes('image')) { // upload any image pasted
                // cancel default behavior
                e.preventDefault();
                this.queueImageInsert(item)
            }
        }
    }

    handleDrop(e) {
        const { items } = e.dataTransfer;
        if (items) {
            for (var i = 0; i < items.length; i++) {
                const item = items[i]
                if (item.type.includes('image')) {
                    e.preventDefault();
                    this.queueImageInsert(item);
                    this.setState({ showDragOverlay: false })
                }
            }
        }
    }

    handleDragOver(e) {
        const { items } = e.dataTransfer;
        if (items) {
            for (var i = 0; i < items.length; i++) {
                const item = items[i]
                if (item.type.includes('image')) {
                    e.preventDefault();
                    this.setState({ showDragOverlay: true });
                    break;
                }
            }
        }
    }

    handleDragEnd(e) {
        e.preventDefault();
        if (this.state.showDragOverlay) {
            this.setState({ showDragOverlay: false })
        }
    }
}
