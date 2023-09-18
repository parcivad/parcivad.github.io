class Popup extends React.Component {

    componentDidMount() {
        if ($("#sideBarView").hasClass("offcanvas")) {
            if ($("#sideBarView").hasClass("show")) {
                document.querySelector('meta[media="(prefers-color-scheme: light)"]')?.setAttribute('content', "#d1d1d1");
                document.querySelector('meta[media="(prefers-color-scheme: dark)"]')?.setAttribute('content', "#151516");
            } else {
                document.querySelector('meta[media="(prefers-color-scheme: light)"]')?.setAttribute('content', "#d3d3d3");
                document.querySelector('meta[media="(prefers-color-scheme: dark)"]')?.setAttribute('content', "#191919");
            }
        } else {
            document.querySelector('meta[media="(prefers-color-scheme: light)"]')?.setAttribute('content', "#d1d1d1");
            document.querySelector('meta[media="(prefers-color-scheme: dark)"]')?.setAttribute('content', "#151516");
        }
    }

    componentWillUnmount() {
        if ($("#sideBarView").hasClass("offcanvas")) {
            if ($("#sideBarView").hasClass("show")) {
                document.querySelector('meta[media="(prefers-color-scheme: light)"]')?.setAttribute('content', "#e7e8ed");
                document.querySelector('meta[media="(prefers-color-scheme: dark)"]')?.setAttribute('content', "#000000");
            } else {
                document.querySelector('meta[media="(prefers-color-scheme: light)"]')?.setAttribute('content', "#ffffff");
                document.querySelector('meta[media="(prefers-color-scheme: dark)"]')?.setAttribute('content', "#0c0c0c");
            }
        } else {
            document.querySelector('meta[media="(prefers-color-scheme: light)"]')?.setAttribute('content', "#fdfdfd");
            document.querySelector('meta[media="(prefers-color-scheme: dark)"]')?.setAttribute('content', "#000000");
        }
    }

    render() {
        return (
            <div
                className="popup position-absolute top-0 w-100 h-100 d-flex align-items-end align-items-md-center justify-content-center"
                onClick={e => {
                    if (e.target.classList.contains("popup")) {
                        this.props.toggle()
                    }
                }}


            >
                <Motion.motion.div
                    initial={{y: "-20vh", opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    exit={{y: "-20vh", opacity: 0}}

                    className="popup-card px-1 pb-5 p-md-5" style={{maxHeight: "90%", overflowY: "auto", zIndex: 100}}>

                    {this.props.children}

                </Motion.motion.div>
            </div>
        );
    }
}

class PPContent extends React.Component {
    render() {
        return (
            <div className="px-2 px-md-0 pb-4 text-center">
                {this.props.children}
            </div>
        );
    }
}

class PPHeadingIcon extends React.Component {
    render() {
        return (
            <div className="col-12 py-4">
                <ion-icon name={this.props.icon} style={{fontSize: "50pt", color: this.props.color}} />
            </div>
        );
    }
}

class PPHeadingImage extends React.Component {
    render() {
        return (
            <div className="col-12 py-4">
                <img alt="popupImage" src={this.props.source} width="68" />
            </div>
        );
    }
}

class PPHeading extends React.Component {
    render() {
        return (
            <h3 style={{fontWeight: 650, fontSize: "20pt"}}>
                {this.props.children}
            </h3>
        );
    }
}

class PPDescription extends React.Component {
    render() {
        return (
            <p className="m-0" style={{fontSize: "10pt", color: "var(--sys-gray)"}}>
                {this.props.children}
            </p>
        );
    }
}

class PPIcon extends React.Component {
    render() {
        return (
            <ion-icon name={this.props.icon} style={{fontSize: "20pt", color: this.props.color}} />
        );
    }
}

class PPButton extends React.Component {
    constructor() {
        super();

        this.state = {triggered: false}
    }
    render() {
        return (
            <div className="col-12 d-flex w-100 justify-content-center pt-1">
                <Motion.motion.button
                    whileTap={{scale: 0.95}}
                    disabled={this.props.disabled}
                    type="button" onClick={() => {this.props.trigger();this.setState({triggered: !this.state.triggered})
                }}
                        style={{backgroundColor: this.props.bgColor, color: this.props.color,
                            minHeight: "35px",
                            minWidth: "200px",
                            borderRadius: "8px",
                            border: "1px solid var(--sys-gray5)",
                            fontSize: "12pt",
                            filter: this.props.disabled ? "grayscale(0.4)" : "",
                            cursor: this.props.disabled ? "not-allowed" : "default"}}>
                    {this.state.triggered ?
                        <ContainerLoaderLight height="35px" />
                        :
                        this.props.children
                    }
                </Motion.motion.button>
            </div>
        );
    }
}

class PPInputText extends React.Component {
    render() {
        return (
            <input className="createInput mt-2" placeholder={this.props.placeholder} type="text" id={this.props.id}
                   onKeyDown={e => { if (e.keyCode === 13) this.props.onEnter()}}
                   onInput={event => {
                       let target = event.currentTarget;
                       this.props.onInput(target.value)
                       // validation
                       target.setCustomValidity(this.props.onValid(target.value))
                       target.reportValidity()
                       event.preventDefault()
                   }}/>
        );
    }
}


class ItemPopupCards extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            closed: new Date(new Date(getDH("identity").lastAccess).getTime() + 7200).getTime() > 1695070900700
        }
    }


    componentDidMount() {
        document.querySelector('meta[media="(prefers-color-scheme: light)"]')?.setAttribute('content', "#d6d7dd");
        //document.querySelector('meta[media="(prefers-color-scheme: dark)"]')?.setAttribute('content', "#000000");
    }

    componentWillUnmount() {
        document.querySelector('meta[media="(prefers-color-scheme: light)"]')?.setAttribute('content', "#e7e8ed");
        document.querySelector('meta[media="(prefers-color-scheme: dark)"]')?.setAttribute('content', "#000000");
    }

    close = () => {
        this.setState({closed: true})
        document.querySelector('meta[media="(prefers-color-scheme: light)"]')?.setAttribute('content', "#e7e8ed");
        document.querySelector('meta[media="(prefers-color-scheme: dark)"]')?.setAttribute('content', "#000000");
    }

    render() {
        if (this.state.closed) return null;

        return (
            <>
                <div className="popup position-absolute top-0 w-100 h-100 d-flex align-items-end align-items-md-center justify-content-center">
                    <Motion.motion.div
                        layout
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{
                            layout: { duration: 0.3 },
                            duration: 0.6,
                            ease: "easeIn"
                        }}

                        id="carousel" className="popup-card carousel slide px-3 px-sm-1 pb-5 p-md-5" data-bs-interval="false" style={{minHeight: "60%"}}>
                        <div className="carousel-inner">
                            <div className="carousel-item active" >
                                <div className="text-center">
                                    <div className="col-12 py-4">
                                        <div className="align-items-center ps-3">
                                            <picture>
                                                <source
                                                    srcSet="/go/img/brand/classync.label.light.svg"
                                                    media="(prefers-color-scheme: dark)" />
                                                <img src="/go/img/brand/classync.label.dark.svg" width="160" alt="Classync Heading Logo" />
                                            </picture>
                                        </div>
                                    </div>
                                    <h3 style={{fontWeight: 650, fontSize: "20pt"}}>Willkommen bei Classync</h3>
                                    <p style={{fontSize: "10pt"}}>Eure Lösung für eine übersichtliche und benutzerfreundliche Stufenverwaltung. Hier kannst du mit deiner Stufe Zitate sammeln, Umfragen starten und Kommentare teilen.</p>
                                    <div className="col-12 pt-3">
                                        <ion-icon name="hand-left" style={{fontSize: "20pt", color: "var(--sys-gray3)"}}/>
                                        <p style={{fontSize: "10pt", color: "var(--sys-gray)"}}>Mit der Verwendung von Classync werden personenbezogene Daten über dich erhoben. Mehr erfährst du unter den <span onClick={() => loadModule("account")} className="actionText">Datenschutz-</span> und <span onClick={() => loadModule("account")} className="actionText">Nutzungsbedingungen</span>.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <div className="text-center">
                                    <div className="col-12 py-4">
                                        <p className="m-0" style={{fontSize: "60pt"}}>🗳️</p>
                                    </div>
                                    <h3 style={{fontWeight: 650, fontSize: "20pt"}}>Umfragen</h3>
                                    <p style={{fontSize: "11pt", color: "var(--sys-gray)"}}>
                                        Bei Umfragen kann die ganze Stufe über eine Frage abstimmen, dabei bietet
                                        Classync verschiedene Einstellungen. Mithilfe sich eine Umfrage interessanter und
                                        nützlicher gestalten lässt.
                                    </p>
                                    <div className="col-12 row row-cols-2 pt-2">
                                        <p className="col-1">👋</p>
                                        <p className="col-11 text-start" style={{fontSize: "10pt"}}>
                                            Bei <strong>Interaktiven</strong> Umfragen kann jeder
                                            berechtigte Schüler eine weitere Option hinzufügen.</p>
                                        <p className="col-1">🥷</p>
                                        <p className="col-11 text-start" style={{fontSize: "10pt"}}>
                                            Mit <strong>Anonymen</strong> Umfragen wird jedem nur das gesamt Ergebnis
                                            angezeigt.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <div className="text-center">
                                    <div className="col-12 py-4">
                                        <p className="m-0" style={{fontSize: "60pt"}}>🚀</p>
                                    </div>
                                    <h3 style={{fontWeight: 650, fontSize: "20pt"}}>Rankings</h3>
                                    <p style={{fontSize: "11pt", color: "var(--sys-gray)"}}>
                                        In Rankings könnt ihr Fragen stellen und darunter anonymisierte für eine Person
                                        abstimmen. Alle können sich Live das Ergebnis und eine Tabellenliste anschauen.
                                    </p>
                                    <div className="col-12 row row-cols-2 pt-2">
                                        <p className="col-1">🙈</p>
                                        <p className="col-11 text-start" style={{fontSize: "10pt"}}>
                                            Bei jedem Ranking kannst du selber deine <strong>Teilnahme beenden</strong> und
                                            wirst von dem Ergebnis ausgeschlossen.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <div className="text-center">
                                    <div className="col-12 py-4">
                                        <p className="m-0" style={{fontSize: "60pt"}}>🍿</p>
                                    </div>
                                    <h3 style={{fontWeight: 650, fontSize: "20pt"}}>Profile</h3>
                                    <p style={{fontSize: "11pt", color: "var(--sys-gray)"}}>
                                        Suche in den Profilen nach Schülern oder Lehrer und interagiere mit deren Profil.
                                    </p>
                                    <div className="col-12 row row-cols-2 pt-2">
                                        <p className="col-1">🙋‍</p>
                                        <p className="col-11 text-start" style={{fontSize: "10pt"}}>
                                            Unter deinem eigenen Profil kannst du Fragen deiner Stufe direkt beantworten.
                                        </p>
                                        <p className="col-1">💭</p>
                                        <p className="col-11 text-start" style={{fontSize: "10pt"}}>
                                            <strong>Kommentiere</strong> unter einem beliebigen Profil deine Bemerkung.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-item" >
                                <div className="text-center">
                                    <div className="col-12 py-4">
                                        <ion-icon name="hammer" style={{fontSize: "50pt", color: "#54c3ff"}} />
                                    </div>
                                    <h3 style={{fontWeight: 650, fontSize: "20pt"}}>Version 1.0</h3>
                                    <p style={{fontSize: "10pt"}}>Ende der Beta 😮</p>
                                    <div className="col-12 pt-3">
                                        <ion-icon name="bulb-outline" style={{fontSize: "20pt", color: "var(--sys-gray3)"}}/>
                                        <p style={{fontSize: "10pt", color: "var(--sys-gray)"}}>
                                            Bugs- und Fehlerbehebung // Neue Features und Design // Verschiedene Funktionen freigeschaltet
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 d-flex w-100 justify-content-center pt-5">
                            <button type="button" data-bs-target="#carousel" data-bs-slide="prev"
                                    style={{backgroundColor: "var(--sys-blue)", color: "#fff",
                                        cursor: "default",
                                        minHeight: "35px",
                                        minWidth: "100px",
                                        borderRadius: "8px",
                                        border: "1px solid var(--sys-gray5)",
                                        fontSize: "12pt"}}>
                                ←
                            </button>
                            <button type="button" data-bs-target="#carousel" data-bs-slide="next"
                                    style={{backgroundColor: "var(--sys-blue)", color: "#fff",
                                        cursor: "default",
                                        minHeight: "35px",
                                        minWidth: "100px",
                                        borderRadius: "8px",
                                        border: "1px solid var(--sys-gray5)",
                                        fontSize: "12pt"}}>
                                →
                            </button>
                        </div>
                        <div className="col-12 d-flex w-100 justify-content-center pt-1">
                            <button type="button" onClick={this.close}
                                    style={{backgroundColor: "var(--sys-blue)", color: "#fff",
                                        cursor: "default",
                                        minHeight: "35px",
                                        minWidth: "200px",
                                        borderRadius: "8px",
                                        border: "1px solid var(--sys-gray5)",
                                        fontSize: "12pt"}}>
                                Loslegen
                            </button>
                        </div>

                    </Motion.motion.div>
                </div>
            </>
        );
    }
}