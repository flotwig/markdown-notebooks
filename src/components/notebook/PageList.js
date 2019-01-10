import React from 'react';
import { Tabs } from '@blueprintjs/core';

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
            <Tabs vertical>
                {this.props.pages.map(page => {
                    return (
                        <div draggable
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
                                        e.preventDefault()
                                    }
                                }}
                             aria-selected={page._id === this.props.activePage._id} 
                             onClick={() => this.props.onClickPage(page)}
                             className="bp3-tab">
                            {page.name}
                        </div>
                    )
                })
                }
            </Tabs>
        )
    }
}