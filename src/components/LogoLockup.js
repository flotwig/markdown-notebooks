import React from 'react';
import { Icon } from '@blueprintjs/core';

export default class LogoLockup extends React.Component {
    render = () => (
        <div style={{fontWeight: '600', fontSize: '1.1em', paddingBottom: '1em', textAlign: 'center'}} className="logo-lockup">
            <Icon icon="book" iconSize="60" style={{marginBottom: '.2em'}}></Icon><br/>
            Markdown<br/>
            Notebooks
        </div>
    )
}