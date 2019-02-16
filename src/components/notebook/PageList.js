import React from 'react';
import { Menu } from '@blueprintjs/core';

/**
 * Displays the list of pages in the sidebar.
 *
 * <PageList pages={pages} onClickPage={(page) => {}} activePage={somePage}/>
 */
export default class PageList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            draggedPage: undefined,
            draggingOver: undefined
        }
    }
    render() {
        return (
            <Menu className="page-list">
                <Menu.Item onClick={()=> this.props.addPage()} icon="plus" text="New Page" className="btn-new-page"/>
                <Menu.Item onClick={()=> this.props.deletePage()} icon="trash" text="Delete Page" className="btn-delete-page"/>
                <Menu.Divider/>
                {this.props.pages.map(page => {
                    return this._renderPage(page)
                })
                }
            </Menu>
        )
    }

    _renderPage(page) {
        return (
            <li>
                <button draggable
                    key={page._id}
                    title={page.name}
                    style={this.state.draggingOver === page ? { borderTop: '2px dashed rgba(19, 124, 189, 0.5)' } : {}}
                    onDragStart={(e) => {
                        e.dataTransfer.dropEffect = "move";
                        this.setState({ draggedPage: page })
                    }}
                    onDragOver={(e) => {
                        e.preventDefault() // allow dropping here
                        this.setState({ draggingOver: page })
                    }}
                    onDragEnd={() => {
                        this.setState({ draggedPage: undefined, draggingOver: undefined })
                    }}
                    onDrop={(e) => {
                        if (page !== this.state.draggedPage) {
                            this.props.movePageToIndex(
                                this.state.draggedPage,
                                this.props.pages.filter(p => p !== this.state.draggedPage).findIndex(p => p === page)
                            );
                            this.setState({ draggedPage: undefined, draggingOver: undefined })
                            e.preventDefault()
                        }
                    }}
                    data-selected={page._id === this.props.activePage._id}
                    onClick={() => this.props.onClickPage(page)}
                    className="bp3-menu-item"
                    >
                    {page.name}
                </button>
            </li>
        )
    }
}
