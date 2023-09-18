class ActionBar extends React.Component {
    render() {
        return (
            <div className="contentActionBar order-0 order-xl-1 col-12 col-xl-4 d-flex pt-1 px-1 justify-content-end sticky-top">
                <div className="d-flex px-2">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

class ABSearchBar extends React.Component {
    render() {
        return (
            <div className="contentActionBarSpacing">
                <label>
                    <input className="searchBar" defaultValue="" onChange={e => this.props.trigger(e.target.value)}
                           placeholder={this.props.placeholder} type="text" />
                </label>
            </div>
        );
    }
}

class ABButton extends React.Component {
    render() {
        return (
            <div className="contentActionBarSpacing">
                <Motion.motion.div
                    whileTap={{scale: 0.95}}
                    className="icon-button icon-action-bar" onClick={this.props.trigger}>
                    <ion-icon name={this.props.icon}></ion-icon>
                </Motion.motion.div>
            </div>
        );
    }
}

class ABGroup extends React.Component {
    render() {
        return (
            <div className="contentActionBarSpacing">
                <div className="icon-group">
                    {this.props.children}
                </div>
            </div>
        );
    }
}