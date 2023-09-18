class ContainerLoader extends React.Component {
    render() {
        return (
            <div className="container-loader" style={{height: this.props.height}}>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="container-loader-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                        <g transform="rotate(0 50 50)">
                            <rect x="45.5" y="12" rx="4.5" ry="4.8" width="9" height="24" fill="#6a6a6a">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8695652173913042s" begin="-0.7608695652173912s" repeatCount="indefinite"></animate>
                            </rect>
                        </g>
                        <g transform="rotate(45 50 50)">
                            <rect x="45.5" y="12" rx="4.5" ry="4.8" width="9" height="24" fill="#6a6a6a">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8695652173913042s" begin="-0.6521739130434782s" repeatCount="indefinite"></animate>
                            </rect>
                        </g>
                        <g transform="rotate(90 50 50)">
                            <rect x="45.5" y="12" rx="4.5" ry="4.8" width="9" height="24" fill="#6a6a6a">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8695652173913042s" begin="-0.5434782608695652s" repeatCount="indefinite"></animate>
                            </rect>
                        </g>
                        <g transform="rotate(135 50 50)">
                            <rect x="45.5" y="12" rx="4.5" ry="4.8" width="9" height="24" fill="#6a6a6a">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8695652173913042s" begin="-0.4347826086956521s" repeatCount="indefinite"></animate>
                            </rect>
                        </g>
                        <g transform="rotate(180 50 50)">
                            <rect x="45.5" y="12" rx="4.5" ry="4.8" width="9" height="24" fill="#6a6a6a">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8695652173913042s" begin="-0.3260869565217391s" repeatCount="indefinite"></animate>
                            </rect>
                        </g>
                        <g transform="rotate(225 50 50)">
                            <rect x="45.5" y="12" rx="4.5" ry="4.8" width="9" height="24" fill="#6a6a6a">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8695652173913042s" begin="-0.21739130434782605s" repeatCount="indefinite"></animate>
                            </rect>
                        </g>
                        <g transform="rotate(270 50 50)">
                            <rect x="45.5" y="12" rx="4.5" ry="4.8" width="9" height="24" fill="#6a6a6a">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8695652173913042s" begin="-0.10869565217391303s" repeatCount="indefinite"></animate>
                            </rect>
                        </g>
                        <g transform="rotate(315 50 50)">
                            <rect x="45.5" y="12" rx="4.5" ry="4.8" width="9" height="24" fill="#6a6a6a">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8695652173913042s" begin="0s" repeatCount="indefinite"></animate>
                            </rect>
                        </g>
                    </svg>
                    <p className="m-0" style={{color: "var(--sys-gray)"}}>{this.props.message}</p>
                </div>
            </div>
        );
    }
}

class ContainerLoaderLight extends React.Component {
    render() {
        return (
            <div className="d-flex justify-content-center align-content-center container-loader" style={{height: this.props.height}}>
                <div>
                    <svg height={this.props.height} xmlns="http://www.w3.org/2000/svg" className="container-loader-svg" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid">
                        <g transform="rotate(0 50 50)">
                            <rect x="45.5" y="12" rx="4.5" ry="4.8" width="9" height="24" fill="#fff">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8695652173913042s" begin="-0.7608695652173912s" repeatCount="indefinite"></animate>
                            </rect>
                        </g>
                        <g transform="rotate(45 50 50)">
                            <rect x="45.5" y="12" rx="4.5" ry="4.8" width="9" height="24" fill="#fff">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8695652173913042s" begin="-0.6521739130434782s" repeatCount="indefinite"></animate>
                            </rect>
                        </g>
                        <g transform="rotate(90 50 50)">
                            <rect x="45.5" y="12" rx="4.5" ry="4.8" width="9" height="24" fill="#fff">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8695652173913042s" begin="-0.5434782608695652s" repeatCount="indefinite"></animate>
                            </rect>
                        </g>
                        <g transform="rotate(135 50 50)">
                            <rect x="45.5" y="12" rx="4.5" ry="4.8" width="9" height="24" fill="#fff">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8695652173913042s" begin="-0.4347826086956521s" repeatCount="indefinite"></animate>
                            </rect>
                        </g>
                        <g transform="rotate(180 50 50)">
                            <rect x="45.5" y="12" rx="4.5" ry="4.8" width="9" height="24" fill="#fff">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8695652173913042s" begin="-0.3260869565217391s" repeatCount="indefinite"></animate>
                            </rect>
                        </g>
                        <g transform="rotate(225 50 50)">
                            <rect x="45.5" y="12" rx="4.5" ry="4.8" width="9" height="24" fill="#fff">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8695652173913042s" begin="-0.21739130434782605s" repeatCount="indefinite"></animate>
                            </rect>
                        </g>
                        <g transform="rotate(270 50 50)">
                            <rect x="45.5" y="12" rx="4.5" ry="4.8" width="9" height="24" fill="#fff">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8695652173913042s" begin="-0.10869565217391303s" repeatCount="indefinite"></animate>
                            </rect>
                        </g>
                        <g transform="rotate(315 50 50)">
                            <rect x="45.5" y="12" rx="4.5" ry="4.8" width="9" height="24" fill="#fff">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8695652173913042s" begin="0s" repeatCount="indefinite"></animate>
                            </rect>
                        </g>
                    </svg>
                    <p className="m-0" style={{color: "var(--sys-gray)"}}>{this.props.message}</p>
                </div>
            </div>
        );
    }
}

class ContainerInformationBanner extends React.Component {
    render() {
        return (
            <div style={{height: "90%", display: "flex", alignItems: "center", justifyContent: "center", overflowY: "hidden"}}>
                <div>
                    <div className="d-flex justify-content-center align-content-center">
                        <ion-icon style={{fontSize: "55px", color: `var(--sys-${this.props.color})`}}
                                  name={this.props.icon}></ion-icon>
                    </div>
                    <h4 className="pt-3 text-center">{this.props.title}</h4>
                    <p className="text-center pb-2"
                       style={{fontSize: "large", color: "var(--sys-gray)"}}>{this.props.description}</p>
                    {this.props.children}
                </div>
            </div>
        );
    }
}