import React from 'react';
import marked from 'marked';
import sanitize from 'sanitize-html';

export default class MarkdownRenderer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renderedMarkdown: ''
        }
    }

    render() {
        return <div dangerouslySetInnerHTML={{__html: this.state.renderedMarkdown}}/>
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.markdown !== prevProps.markdown) {
            this.renderMarkdown(this.props.markdown)
        }
    }

    renderMarkdown(markdown) {
        marked(markdown, (error, result) => {
            this.setHtml(result);
        })
    }

    setHtml(html) {
        let sanitized = this.sanitizeHtml(html);
        this.setState({ renderedMarkdown: sanitized });
    }

    sanitizeHtml(html) {
        return sanitize(html, {
            allowedTags: [
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'img', 'a', 'b', 'p', 'i', 'em', 'strong', 'blockquote', 'big', 'small', 'div', 'br', 'hr', 'li', 'ol', 'ul', 'table', 'tbody', 'thead', 'td', 'th', 'tr', 'caption', 'span'
            ],
            allowedAttributes: {
                'a': ['href', 'target', 'rel'],
                'img': ['src', 'alt']
            },
            transformTags: {
                'a': (tagName, attribs) => {
                    // Always open links in a new window
                    if (attribs) {
                        attribs.target = '_blank';
                        attribs.rel = 'noopener noreferrer';
                    }
                    return { tagName, attribs };
                }
            }
        })
    }
}