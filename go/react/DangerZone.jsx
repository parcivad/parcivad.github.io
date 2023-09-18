class DZItem extends React.Component {
    render() {
        return (
            <>
                <div className="col-8">
                    <div className="px-1 pt-3">
                        <h6 className="mb-1">{this.props.title}</h6>
                        <p>{this.props.description}</p>
                    </div>
                </div>
                <div className="col-4 d-flex justify-content-end">
                    <div className="d-flex align-self-center">
                        <button id="deleteButton" style={{borderRadius: "10px"}}
                                className="btn btn-danger" onClick={this.props.trigger}>
                            {this.props.buttonText}
                        </button>
                    </div>
                </div>
            </>
        );
    }
}

class DZItems extends React.Component {
    render() {
        return (
            <div className="px-2" style={{borderRadius: "10px", border: "1px solid var(--sys-red)"}}>
                <div className="row">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

class DZTitle extends React.Component {
    render() {
        return (
            <h5 className="pt-2">{this.props.children}</h5>
        );
    }
}

class DangerZone extends React.Component {
    render() {
        return (
            <div className="col-12 py-4">
                {this.props.children}
            </div>
        );
    }
}