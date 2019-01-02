import React from 'react';
import { Text, Tab, Tabs} from '@blueprintjs/core';

/**
 * <PageList pages={pages} onClickPage={(page) => {}} activePage={somePage}/>
 */
export default class PageList extends React.Component {
    render() {
        return (
            <Tabs selectedTabId={this.props.activePage._id} 
                  vertical
                  onChange={(id) => this.props.onClickPage(this.props.pages.find(p => p._id === id))}>
                {this.props.pages.map(page => {
                    return (
                        <Tab key={page._id} id={page._id} title={<Text ellipsize={true}>{page.name}</Text>}/>
                    )
                })}
            </Tabs>
        )
    }
}