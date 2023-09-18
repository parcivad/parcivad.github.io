class Header extends React.Component {
    render() {
        return (
            <div className="contentHeader order-1 order-xl-0 col-12 col-xl-8 d-flex pt-3 pt-sm-1 " style={{color: this.props.color}}>
                <h2>{this.props.title}</h2>
                {this.props.children}
            </div>
        );
    }
}

class HDescription extends React.Component {
    render() {
        return (
            <div className="align-self-center ps-1" style={{paddingTop: "8px"}}>
                <h5>{this.props.description}</h5>
            </div>
        );
    }
}

class HSorting extends React.Component {
    renderOptions() {
        let elements = [];
        for (let key in this.props.options) {
            elements.push(<option key={key} value={key}>{this.props.options[key]}</option>)
        }

        return elements;
    }

    render() {
        return (
            <div className="align-self-end" style={{lineHeight: "1.9"}}>
                <label>
                    <select className="ps-2 pe-3 px-0 align-text-bottom contentHeaderSorting"
                            style={{color: "currentColor"}} defaultValue={this.props.default}
                            onChange={e => this.props.trigger(e.target.value)}>
                        {this.renderOptions()}
                    </select>
                </label>
            </div>
        );
    }
}