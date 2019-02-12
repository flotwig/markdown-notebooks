import React from 'react';
import marked from 'marked';
import sanitize from 'sanitize-html';

const renderer = new marked.Renderer()

renderer.checkbox = function(checked) {
    return '<input '
      + (checked ? 'checked="" ' : '')
      + 'disabled="" type="checkbox" '
      + 'data-rendered-by="markdown-renderer"'
      + (this.options.xhtml ? ' /' : '')
      + '> ';
  };

/**
 * Standalone renderer for input markdown.
 *
 * Sanitizes output HTML from markdown as well.
 */
export default class MarkdownRenderer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renderedMarkdown: ''
        }
        this.containerRef = React.createRef()
    }

    render() {
        return <div className="markdown-renderer"
                    dangerouslySetInnerHTML={{__html: this.state.renderedMarkdown}}
                    ref={this.containerRef}
                    />
    }

    componentDidMount() {
        this.renderMarkdown(this.props.markdown)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.markdown !== prevProps.markdown) {
            this.renderMarkdown(this.props.markdown)
        }
        if (this.state.renderedMarkdown !== prevState.renderedMarkdown) {
            this.attachCheckboxListeners()
        }
    }

    /**
     * Attaches listeners to GFM checkboxes.
     */
    attachCheckboxListeners() {
        const _this = this;
        let checkboxIndex = 0;
        this.containerRef.current.querySelectorAll('input[type="checkbox"]').forEach(node => {
            if (node.getAttribute('data-rendered-by') !== 'markdown-renderer') {
                node.setAttribute('disabled', true)
                return
            }
            const thisCheckboxIndex = checkboxIndex
            checkboxIndex++
            node.addEventListener('change', e => {
                _this.onCheckboxToggle(thisCheckboxIndex, e.target.checked)
            })
        })
    }

    /**
     * Renders markdown into the display area.
     *
     * @param {string} markdown Input markdown text
     */
    renderMarkdown(markdown) {
        marked(markdown, { renderer }, (error, result) => {
            this.setHtml(result);
        })
    }

    /**
     * Sanitizes the HTML and changes the rendered output.
     *
     * @param {string} html Unsafe HTML string
     */
    setHtml(html) {
        let sanitized = this.sanitizeHtml(html);
        this.setState({ renderedMarkdown: sanitized });
    }

    sanitizeHtml(html) {
        return sanitize(html, {
            allowedTags: [
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7',
                'img', 'a', 'b', 'p', 'i', 'em', 'strong',
                'blockquote', 'big', 'small', 'div', 'br',
                'hr', 'li', 'ol', 'ul', 'table', 'tbody',
                'thead', 'td', 'th', 'tr', 'caption',
                'span', 'code', 'del', 's', 'input'
            ],
            allowedAttributes: {
                'a': ['href', 'target', 'rel'],
                'img': ['src', 'alt'],
                'input': [
                    {
                        name: 'type',
                        values: ['checkbox']
                    },
                    {
                        name: 'data-rendered-by',
                        values: ['markdown-renderer']
                    },
                    'checked'
                ]
            },
            transformTags: {
                'a': (tagName, attribs) => {
                    // Always open links in a new window
                    if (attribs) {
                        attribs.target = '_blank';
                        attribs.rel = 'noopener noreferrer';
                    }
                    return { tagName, attribs };
                },
                'input': (tagName, attribs) => {
                    if (attribs.type !== 'checkbox') {
                        return false
                    }

                    return { tagName, attribs }
                }
            }
        })
    }

    onCheckboxToggle(checkboxIndex, value) {
        this.props.onCheckboxToggle(checkboxIndex, value)
    }
}
