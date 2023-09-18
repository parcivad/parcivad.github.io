class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {subPoints: this.props.opened}
    }

    render() {
        let i=0;

        return (
            <div>
                <div className="d-flex justify-content-between cursor-pointer pb-3" onClick={() => this.setState({subPoints: !this.state.subPoints})}>
                    <div className="d-flex align-items-center">
                        <div className="pe-2">
                            {this.props.children.slice(0, 1)}
                        </div>
                        <p className="m-0" style={{fontWeight: 500, fontSize: "12pt"}}>{this.props.title}</p>
                    </div>
                    <div>
                        <ion-icon style={{fontSize: "14pt", color: "var(--sys-gray0)"}}
                                  name={this.state.subPoints ? "remove-outline" : "add"} />
                    </div>
                </div>
                <Motion.AnimatePresence>
                    {this.state.subPoints && (
                        <Motion.motion.div
                            initial={{height: 0}}
                            animate={{ height: "auto" }}
                            exit={{height: 0}}
                            className="overflow-hidden">
                            <div className="d-flex pb-3" style={{paddingLeft: "11px"}}>
                                <div style={{width: "3px", borderRadius: "4px", backgroundColor: "var(--sys-gray5)"}}/>
                                <div className="ps-4 w-100 sideBarSubPoints">
                                    {this.props.children.slice(1)}
                                </div>
                            </div>
                        </Motion.motion.div>
                    )}
                </Motion.AnimatePresence>
            </div>
        );
    }
}

class SBSubPoint extends React.Component {
    render() {
        return (
            <Motion.motion.p
                whileTap={{scale: 0.95}}
                onClick={() => this.props.trigger()}
                role="button" data-bs-dismiss="offcanvas" aria-label="Close"
                className="cursor-pointer"

                initial={{opacity: 0, scale: 0.6, y: 20}}
                animate={{opacity: 1, scale: 1, y: 0}}
                transition={{delay: this.props.delay}}
                whileHover={{color: "var(--sys-gray)", transition: {duration: 0.3, ease: "easeOut"}}}
                style={{fontWeight: 450, fontSize: "11pt"}}>
                {this.props.title}
            </Motion.motion.p>
        );
    }
}