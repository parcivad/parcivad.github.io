class Classync extends React.Component {
    constructor(props) {
        super(props);

        let params = new URLSearchParams(window.location.search),
            content = params.get("c");

        this.state = {
            content: content ? content : "p",
            canvas: false
        }

        this.contentMap = {
            "h": <ContentHome />,
            "r": <ContentRanking />,
            "q": <ContentQuotation />,
            "s": <ContentStudents />,
            "t": <ContentTeachers />,
            "f": <ContentFinance />,
            "a": <ContentAccount />,
            "m": <ContentModeration />,
            "l": <ContentLegalWritings />,
            "c": <ContentCalendar />,
            "p": <ContentPoll />,
            "pr": <ContentProfile />,
            "au": <ContentAuditLog />
        }

        this.themeChange()
    }

    componentDidMount() {
        // look for state on mount
        if($(window).width() < 720) {
            if (this.state.canvas) return;
            this.startCanvas()
            this.state.canvas = true;
            return;
        }
        if (!this.state.canvas) return;
        this.stopCanvas()
        this.state.canvas = false;
        return;

        // look for theme on mount
        this.themeChange();

        // add event lister
        const myOffcanvas = document.getElementById('sideBarView')
        myOffcanvas.addEventListener('hidden.bs.offcanvas', event => {
            this.themeChange();
        })
    }

    /**
     * Checks inner width and if canvas is active to adjust to needs
     * @returns {boolean}
     */
    wr = () => {
        if($(window).width() < 720) {
            if (this.state.canvas) return true;
            this.startCanvas()
            this.state.canvas = true;
            return true;
        }
        if (!this.state.canvas) return true;
        this.stopCanvas()
        this.state.canvas = false;
        return true;
    }

    // Starts canvas by adjusting css
    startCanvas() {
        $("#sideBarView")
            .addClass("offcanvas")
            .addClass("offcanvas-start")
        $("#sideBarToggle")
            .removeClass("display-none");
        this.themeChange()
    }

    // Stops canvas by adjusting css
    stopCanvas() {
        $("#sideBarView")
            .removeClass("offcanvas")
            .removeClass("offcanvas-start")
            .removeClass("show")
            .removeAttr("aria-hidden")
            .removeAttr("style")
        $("#sideBarToggle").addClass("display-none")
        $(".offcanvas-backdrop").remove()
        this.themeChange()
    }

    // Handles theme of the browser via canvas state and given system ui themen
    themeChange() {
        if ($("#sideBarView").hasClass("offcanvas")) {
            if ($("#sideBarView").hasClass("show")) {
                document.querySelector('meta[media="(prefers-color-scheme: light)"]')?.setAttribute('content', "#fdfdfd");
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

    /**
     * TODO: out of element
     * Open content via short point from contentMap
     * @param content
     */
    openContent(content) {
        // prepare current tag
        let params = new URLSearchParams(window.location.search)
        params.delete("c")
        params.set("c", content)

        // push new url
        let url = window.location.origin+window.location.pathname+"?"+params.toString()
        window.history.pushState({}, '', url)

        // update state
        this.setState({content: content})
        this.themeChange();
    }

    /**
     * Render Classync Application
     * @returns {JSX.Element}
     */
    render() {
        return (
            <div id="homeView" className="h-100" onLoad={() => $(window).resize(this.wr)}>

                <a id="sideBarToggle" className="sideBarToggle display-none ms-2" onClick={() => this.themeChange()}
                   role="button" data-bs-toggle="offcanvas" href="classync/home#sideBarView" aria-controls="offcanvasExample">
                    <ion-icon style={{color: "var(--sys-blue)"}} name="chevron-back-outline">Zurück</ion-icon>
                </a>

                <div className="row h-100">
                    <div id="sideBarView" className="sideBar h-100 p-0 ps-2 m-0 overflow-hidden"
                         tabIndex="-1" aria-labelledby="offcanvasExampleLabel">
                        <div className="h-100 d-flex flex-column ps-1" style={{paddingTop: "32px"}}>
                            <div className="align-items-center ps-3">
                                <picture>
                                    <source
                                        srcSet="/go/img/brand/classync.label.light.svg"
                                        media="(prefers-color-scheme: dark)" />
                                    <img src="/go/img/brand/classync.label.dark.svg" width="160" alt="Classync Heading Logo" />
                                </picture>
                            </div>
                            <div className="ps-3 pe-4 pt-4 overflow-scroll">
                                <div className="d-flex justify-content-start cursor-pointer pb-3"
                                     role="button" data-bs-dismiss="offcanvas" aria-label="Close"
                                     onClick={() => this.openContent("h")}>
                                    <div className="d-flex align-items-center">
                                        <div className="pe-2">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 10.5651C3 9.9907 3 9.70352 3.07403 9.43905C3.1396 9.20478 3.24737 8.98444 3.39203 8.78886C3.55534 8.56806 3.78202 8.39175 4.23539 8.03912L11.0177 2.764C11.369 2.49075 11.5447 2.35412 11.7387 2.3016C11.9098 2.25526 12.0902 2.25526 12.2613 2.3016C12.4553 2.35412 12.631 2.49075 12.9823 2.764L19.7646 8.03913C20.218 8.39175 20.4447 8.56806 20.608 8.78886C20.7526 8.98444 20.8604 9.20478 20.926 9.43905C21 9.70352 21 9.9907 21 10.5651V17.8C21 18.9201 21 19.4801 20.782 19.908C20.5903 20.2843 20.2843 20.5903 19.908 20.782C19.4802 21 18.9201 21 17.8 21H6.2C5.07989 21 4.51984 21 4.09202 20.782C3.71569 20.5903 3.40973 20.2843 3.21799 19.908C3 19.4801 3 18.9201 3 17.8V10.5651Z" stroke="var(--sys-black)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <p className="m-0" style={{fontWeight: 500, fontSize: "12pt"}}>Übersicht</p>
                                    </div>
                                </div>
                                {/*TODO:<Sidebar title="Schnellzugriff" opened={false}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 2L4.09344 12.6879C3.74463 13.1064 3.57023 13.3157 3.56756 13.4925C3.56524 13.6461 3.63372 13.7923 3.75324 13.8889C3.89073 14 4.16316 14 4.70802 14H12L11 22L19.9065 11.3121C20.2553 10.8936 20.4297 10.6843 20.4324 10.5075C20.4347 10.3539 20.3663 10.2077 20.2467 10.1111C20.1092 10 19.8368 10 19.292 10H12L13 2Z" stroke="var(--sys-black)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <SBSubPoint title="✋ Neue Beiträge" trigger={() => this.openContent("r")}/>
                                    <SBSubPoint title="❤️ Gefällt mir" trigger={() => this.openContent("r")}/>
                                </Sidebar>*/}
                                <div className="divider mb-3"/>
                                <Sidebar title="Community" opened={true}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.66113 18.3391L7.25499 13.7452M18.2175 2.78271C21.9275 6.4927 21.9275 12.5078 18.2175 16.2177C14.5075 19.9277 8.49243 19.9277 4.78245 16.2177M17 22.0002H6.99997M12 22.0002V19.0002M17.5 9.50023C17.5 12.8139 14.8137 15.5002 11.5 15.5002C8.18626 15.5002 5.49997 12.8139 5.49997 9.50023C5.49997 6.18652 8.18626 3.50023 11.5 3.50023C14.8137 3.50023 17.5 6.18652 17.5 9.50023Z" stroke="var(--sys-black)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <SBSubPoint title="🗳️ Umfragen" trigger={() => this.openContent("p")}/>
                                    <SBSubPoint title="🚀 Rankings" trigger={() => this.openContent("r")}/>
                                    <SBSubPoint title="🍿 Profile" trigger={() => this.openContent("pr")}/>
                                    <SBSubPoint title="💬 Zitate" trigger={() => this.openContent("q")}/>
                                </Sidebar>
                                <Sidebar title="Verwaltung" opened={true}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7ZM15.5 17.5L14 16M15 13.5C15 15.433 13.433 17 11.5 17C9.567 17 8 15.433 8 13.5C8 11.567 9.567 10 11.5 10C13.433 10 15 11.567 15 13.5Z" stroke="var(--sys-black)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <SBSubPoint title="💸 Finanzübersicht" trigger={() => this.openContent("f")}/>
                                    <SBSubPoint title="🛡️ Moderation" trigger={() => this.openContent("m")}/>
                                    {hasPermission(Permission.AUDITLOG_SHOW) ?
                                        <SBSubPoint title="👁️ AuditLog" trigger={() => this.openContent("au")}/>
                                        : null
                                    }
                                    <SBSubPoint title="🏫 Kollegium" trigger={() => this.openContent("t")}/>
                                    <SBSubPoint title="👨‍🎓‍ Schüler" trigger={() => this.openContent("s")}/>
                                </Sidebar>
                                <Sidebar title="Kalender" opened={true}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 10H3M16 2V6M8 2V6M7.8 22H16.2C17.8802 22 18.7202 22 19.362 21.673C19.9265 21.3854 20.3854 20.9265 20.673 20.362C21 19.7202 21 18.8802 21 17.2V8.8C21 7.11984 21 6.27976 20.673 5.63803C20.3854 5.07354 19.9265 4.6146 19.362 4.32698C18.7202 4 17.8802 4 16.2 4H7.8C6.11984 4 5.27976 4 4.63803 4.32698C4.07354 4.6146 3.6146 5.07354 3.32698 5.63803C3 6.27976 3 7.11984 3 8.8V17.2C3 18.8802 3 19.7202 3.32698 20.362C3.6146 20.9265 4.07354 21.3854 4.63803 21.673C5.27976 22 6.11984 22 7.8 22Z" stroke="var(--sys-black)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <SBSubPoint title="🎓 Stundenplan" trigger={() => this.openContent("c")}/>
                                </Sidebar>
                            </div>
                            <div style={{flexGrow: 1}}/>
                            <div>
                                <div className="d-flex px-2 pt-1 pb-4 justify-content-between align-content-center align-items-center cursor-pointer"
                                     role="button" data-bs-dismiss="offcanvas" aria-label="Close"
                                     onClick={() => this.openContent("a")}>
                                    <div className="d-flex align-content-center align-items-center cursor-pointer">
                                        <ItemAvatar size="48px" />
                                        <div className="ps-2">
                                            <p className="m-0" style={{marginBottom: "10px", fontSize: "13pt", fontWeight: "450"}}>
                                                {getDH("identity").name.firstname} {getDH("identity").name.lastname}
                                            </p>
                                            <p className="m-0" style={{fontSize: "9pt", color: "var(--sys-gray)"}}>
                                                Löwenrot Abi2024
                                            </p>
                                        </div>
                                    </div>
                                    <ion-icon style={{fontSize: "20pt", color: "var(--sys-gray)"}} name="cog-outline" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="contentHome col p-0 py-md-2 m-0 h-100">
                        <div className="contentHomeInner h-100">
                            <div className="content p-0 m-0 m-md-1">
                                <div className="h-100">
                                    {this.contentMap[this.state.content]}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class ClassyncOAuthProcess extends React.Component {
    constructor(props) {
        super(props);

        let ic = getParam("ic") !== null ? getParam("ic") : "";
        this.state = {
            helpPopup: false,
            register: false,
            loginUsername: "",
            loginPassword: "",
            loginState: "",

            regInstance: getParam("i") !== null ? getParam("i") : "",
            regCodeSlot1: ic.charAt(0),
            regCodeSlot2: ic.charAt(1),
            regCodeSlot3: ic.charAt(2),
            regCourses: [],
            regFirstname: "",
            regLastname: "",
            regEmail: "",
            regPassword: "",
            regState: ""
        }
    }

    validCodeSlot(value) {
        if (isNaN(value)) return "Keine Buchstaben oder Sonderzeichen eingeben"
        return false
    }

    validLoginUsername(value) {
        if (value.includes("@")) return "Keine E-Mail Addresse eingeben"
        if (value.includes(" ")) return "Kein Leerzeichen eingeben"
        return false
    }

    validRegisterName(value) {
        let format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
        if (value.length === 0) return "Feld ausfüllen"
        if (format.test(value)) return "Keine Sonder- oder Leerzeichen"
        return false
    }

    validEmailAddress(value) {
        let format = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
        if (!format.test(value)) return "Gültige Email eintragen"
        return false
    }

    login() {
        this.setState({loginState: "requesting"})

        if (this.state.loginUsername.length < 3 || this.state.loginPassword.length < 6 || this.state.loginUsername.includes("@") || !this.state.loginUsername.includes(".")) {
            this.setState({loginState: "failed"})
            return
        }

        call("/student/login", "POST", JSON.stringify({
            "name": {
                "firstname": this.state.loginUsername.split(".")[0],
                "lastname": this.state.loginUsername.split(".")[1].split("@")[0]
            },
            "password": this.state.loginPassword
        }), null)
            .then(value => {
                if (isset(value["error_key"])) {
                    this.setState({loginState: value["error_key"]})
                } else {
                    setCookies(value)
                    bootUp().then(() => root.render(<Classync />));
                }

            }).catch(error => {
            this.setState({loginState: "failed"})
        })

    }

    register() {
        this.setState({regState: "requesting"})

        console.debug(this.state.regCourses)

        if (this.validRegisterName(this.state.regFirstname) || this.validRegisterName(this.state.regLastname)
            || this.validEmailAddress(this.state.regEmail) || this.state.regCourses.length === 0 || this.state.regPassword.length < 6) {
            this.setState({regState: "failed"})
            return
        }

        call("/student/register", "POST", JSON.stringify({
            "name": {
                "firstname": this.state.regFirstname,
                "lastname": this.state.regLastname,
            },
            "email": this.state.regEmail,
            "password": this.state.regPassword,
            "courses": this.state.regCourses
        }), null)
            .then(value => {
                if (isset(value["error_key"])) {
                    this.setState({regState: value["error_key"]})
                    console.debug(value)
                } else {
                    setCookies(value)
                    bootUp().then(() => root.render(<Classync />));
                }
            })
    }

    loginConfirmButtonElement() {
        switch (this.state.loginState) {
            case "bad_credentials":
                return <ion-icon name="ban" style={{color: "currentColor"}} />
            case "requesting":
                return <ion-icon name="ellipsis-horizontal" style={{color: "currentColor"}} />
            case "failed":
                return <ion-icon name="warning-outline" style={{color: "currentColor"}} />
            default:
                return <ion-icon name="arrow-forward-outline" style={{color: "currentColor"}}/>
        }
    }

    registerConfirmButtonElement() {
        switch (this.state.regState) {
            case "request_duplicated":
                return <p className="m-0" style={{fontWeight: "600"}}>Name/Email existiert schon</p>
            case "bad_credentials":
                return <ion-icon name="ban" style={{color: "currentColor"}} />
            case "requesting":
                return <ion-icon name="ellipsis-horizontal" style={{color: "currentColor"}} />
            case "failed":
                return <ion-icon name="warning-outline" style={{color: "currentColor"}} />
            default:
                return <p className="m-0" style={{fontWeight: "600"}}>Registrieren</p>
        }
    }

    render() {
        let regPassStrength = zxcvbn(this.state.regPassword).score;

        return (
            <>
                {this.state.helpPopup ?
                    <Popup toggle={() => this.setState({helpPopup: !this.state.helpPopup})}>
                        <div className="overflow-hidden">
                            <div className="row row-cols-1 row-cols-md-2 mt-3 mt-sm-0 px-3 px-sm-0 overflow-hidden">
                                <div className="col">
                                    <div className="w-100 contentAuthHelpCard">
                                        <div className="w-100" style={{background: 'var(--sys-gray4) url("/go/img/resources/OAuthProcess/helpCard1.svg") no-repeat center'}} />
                                        <p className="ps-1 m-0 fw-bold">Schule</p>
                                        <p className="ps-1 pb-2" style={{fontSize: "11pt", color: "var(--sys-gray)"}}>Überprüfe ob du deine Schule bzw. Stufe ausgewählt hast.</p>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="w-100 contentAuthHelpCard">
                                        <div className="w-100" style={{background: 'var(--sys-gray4) url("/go/img/resources/OAuthProcess/helpCard2.svg") no-repeat center'}} />
                                        <p className="ps-1 m-0 fw-bold">Benutzername</p>
                                        <p className="ps-1 pb-2" style={{fontSize: "11pt", color: "var(--sys-gray)"}}>Benutzername besteht aus deinem "Vornamen.Nachname".</p>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="w-100 contentAuthHelpCard">
                                        <div className="w-100" style={{background: 'var(--sys-gray4) url("/go/img/resources/OAuthProcess/helpCard3.svg") no-repeat center'}}/>
                                        <p className="m-0 fw-bold">Passwort</p>
                                        <p className="pb-2" style={{fontSize: "11pt", color: "var(--sys-gray)"}}>Dein Passwort muss mindestens 6 Zeichen lang sein.</p>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="w-100 contentAuthHelpCard">
                                        <div className="w-100" style={{background: 'var(--sys-blue)'}}/>
                                        <p className="ps-1 m-0 fw-bold">Support</p>
                                        <p className="ps-1 pb-2" style={{fontSize: "11pt", color: "var(--sys-gray)"}}>Für zusätzliche Hilfe kannst du jederzeit eine Mail schreiben.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Popup>
                    :
                    null
                }
                <div className="position-absolute w-100 h-100 overflow-hidden" style={{backgroundColor: "var(--bg-sidebar)"}}>
                    <div className="d-flex justify-content-center align-items-center w-100 h-100">
                        <div className="col-11 col-md-6 col-xl-4 d-flex align-items-center justify-content-center">
                            {!this.state.register ?
                                <div className="w-100" style={{maxWidth: "450px"}}>
                                    <div className="d-flex align-items-center justify-content-center pb-4">
                                        <picture>
                                            <source
                                                srcSet="/go/img/brand/classync.label.light.svg"
                                                media="(prefers-color-scheme: dark)"/>
                                            <img src="/go/img/brand/classync.label.dark.svg" width="260"
                                                 alt="Classync Heading Logo"/>
                                        </picture>
                                    </div>

                                    <div>
                                        <div className="input-group mb-3" style={{border: 0, borderRadius: "15px"}}>
                                            <select className="form-select selector" value="LRGYM">
                                                <option value="LRGYM">Löwenrot Abi2024</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="input-group" data-index="1">
                                            <input id="logUser" className="contentAuthInput form-control" type="text"
                                                   placeholder="Benutzername" aria-label="name"
                                                   data-error={this.state.loginState === "bad_credentials"}
                                                   onInput={e => {
                                                       if (this.validLoginUsername(e.currentTarget.value)) {
                                                           e.currentTarget.setCustomValidity(this.validLoginUsername(e.currentTarget.value))
                                                           e.currentTarget.reportValidity()
                                                           e.preventDefault()
                                                           return
                                                       }
                                                       e.currentTarget.setCustomValidity("")
                                                   }}
                                                   onChange={e => {
                                                       this.setState({
                                                           loginUsername: e.target.value,
                                                           loginState: ""
                                                       })
                                                   }}
                                                   onKeyDown={e => { if (e.keyCode === 13) $("#logPass").focus()}} />
                                        </div>

                                        <div className="mt-3">
                                            <div className="input-group">
                                                <input id="logPass"  className="contentAuthInput form-control"
                                                       type="password" placeholder="Passwort" aria-label="password"
                                                       data-error={this.state.loginState === "bad_credentials"}
                                                       onInput={e => {
                                                           if (e.currentTarget.value.length < 6) {
                                                               e.currentTarget.setCustomValidity("min. 6 Zeichen")
                                                               e.currentTarget.reportValidity()
                                                               e.preventDefault()
                                                               return
                                                           }
                                                           e.currentTarget.setCustomValidity("")
                                                       }}
                                                       onChange={e => this.setState({
                                                           loginPassword: e.target.value,
                                                           loginState: ""
                                                       })}
                                                       onKeyDown={e => { if (e.keyCode === 13) this.login()}} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between pt-4">
                                        <button className="contentAuthButton" type="submit" onClick={() => this.setState({register: true})}
                                                style={{width: "30%", backgroundColor: "var(--sys-gray6)", color: "var(--sys-gray)"}}>
                                            Neu hier
                                        </button>
                                        <button className="contentAuthButton d-flex align-items-center justify-content-center"
                                                type="submit" onClick={() => this.setState({helpPopup: !this.state.helpPopup})}
                                                style={{width: "9%", backgroundColor: "var(--sys-gray5)", color: "var(--sys-gray)"}}>
                                            ?
                                        </button>
                                        <Motion.motion.button
                                            animate={{color: this.state.loginState ? ["#fff", "#007aff", "#fff"] : "#fff"}}
                                            transition={{repeat: this.state.loginState ? Infinity : false, duration: 2}}
                                            className="contentAuthButton d-flex align-items-center justify-content-center"
                                            type="submit" value="Login" onClick={() => this.login()}
                                            style={{width: "58%", backgroundColor: "var(--sys-blue)", color: "#fff"}}>
                                            {this.loginConfirmButtonElement()}
                                        </Motion.motion.button>
                                    </div>
                                </div>
                                :
                                <div className="w-100" style={{maxWidth: "450px"}}>
                                    <div className="d-flex align-items-center justify-content-center pb-4">
                                        <picture>
                                            <source
                                                srcSet="/go/img/brand/classync.label.light.svg"
                                                media="(prefers-color-scheme: dark)"/>
                                            <img src="/go/img/brand/classync.label.dark.svg" width="260"
                                                 alt="Classync Heading Logo"/>
                                        </picture>
                                    </div>

                                    <div>
                                        <div className="mb-3" style={{border: 0, borderRadius: "15px", backgroundColor: "var(--sys-gray6)"}}>
                                            <select className="form-select selector" placeholder="Instanz wählen"
                                                    value={this.state.regInstance}
                                                    onChange={e => this.setState({regInstance: e.currentTarget.value})}
                                                    style={{border: "1px solid var(--sys-gray4)", zIndex: 1}}>
                                                <option value="" disabled={true}>Instanz wählen</option>
                                                <option value="gymlr2024">Löwenrot Abi2024</option>
                                                <option value="gymw2024">Gymnasium Walldorf Abi2024</option>
                                            </select>
                                            <Motion.AnimatePresence>
                                                {this.state.regInstance !== "" && (
                                                    <Motion.motion.div
                                                        initial={{opacity: 0, height: 0}}
                                                        animate={{opacity: 1, height: "auto"}}
                                                        exit={{opacity: 0, height: 0}}
                                                    >
                                                        <div className="roundContainerInner d-flex justify-content-evenly align-items-center overflow-hidden">
                                                            <div className="col-4">
                                                                <p className="m-0" style={{fontWeight: 550, color: "var(--sys-gray)"}}>Euer Stufen Code: </p>
                                                            </div>
                                                            <div className="col-2 shadow-sm" style={{border: "1px solid var(--sys-gray3)", borderRadius: "8px"}}>
                                                                <input id="codeSlot1" className="contentAuthCodeInput form-control" type="text"
                                                                       placeholder="-" value={this.state.regCodeSlot1}
                                                                       data-error={this.state.regState === "bad_credentials"}
                                                                       onInput={e => {
                                                                           if (this.validCodeSlot(e.currentTarget.value)) {
                                                                               e.currentTarget.setCustomValidity(this.validCodeSlot(e.currentTarget.value))
                                                                               e.currentTarget.reportValidity()
                                                                               e.preventDefault()
                                                                               return
                                                                           }
                                                                           e.currentTarget.setCustomValidity("")
                                                                       }}
                                                                       onChange={e => {
                                                                           this.setState({regCodeSlot1: e.target.value.slice(-1), regState: ""})
                                                                           if (e.currentTarget.value.length !== 0)  $("#codeSlot2").focus()
                                                                       }}/>
                                                            </div>
                                                            <div className="col-2 shadow-sm" style={{border: "1px solid var(--sys-gray3)", borderRadius: "8px"}}>
                                                                <input id="codeSlot2" className="contentAuthCodeInput form-control" type="text"
                                                                       placeholder="-" value={this.state.regCodeSlot2}
                                                                       data-error={this.state.regState === "bad_credentials"}
                                                                       onInput={e => {
                                                                           if (this.validCodeSlot(e.currentTarget.value)) {
                                                                               e.currentTarget.setCustomValidity(this.validCodeSlot(e.currentTarget.value))
                                                                               e.currentTarget.reportValidity()
                                                                               e.preventDefault()
                                                                               return
                                                                           }
                                                                           e.currentTarget.setCustomValidity("")
                                                                       }}
                                                                       onChange={e => {
                                                                           this.setState({regCodeSlot2: e.currentTarget.value.slice(-1), regState: ""})
                                                                           if (e.currentTarget.value.length !== 0) $("#codeSlot3").focus()
                                                                       }}/>
                                                            </div>
                                                            <div className="col-2 shadow-sm" style={{border: "1px solid var(--sys-gray3)", borderRadius: "8px"}}>
                                                                <input id="codeSlot3" className="contentAuthCodeInput form-control" type="text"
                                                                       placeholder="-" value={this.state.regCodeSlot3}
                                                                       data-error={this.state.regState === "bad_credentials"}
                                                                       onInput={e => {
                                                                           if (this.validCodeSlot(e.currentTarget.value)) {
                                                                               e.currentTarget.setCustomValidity(this.validCodeSlot(e.currentTarget.value))
                                                                               e.currentTarget.reportValidity()
                                                                               e.preventDefault()
                                                                               return
                                                                           }
                                                                           e.currentTarget.setCustomValidity("")
                                                                       }}
                                                                       onChange={e => {
                                                                           this.setState({regCodeSlot3: e.currentTarget.value.slice(-1), regState: ""})
                                                                       }}/>
                                                            </div>
                                                        </div>
                                                    </Motion.motion.div>
                                                )}
                                            </Motion.AnimatePresence>
                                        </div>
                                    </div>

                                    <div className="roundContainer display-none">
                                        <div className="roundContainerInner d-flex justify-content-center align-items-center" style={{border: "3px dashed var(--sys-red)"}}>
                                            <ContainerInformationBanner color="var(--sys-gray)" title="Registrierung beendet" description="Diese Stufe hat den Registrierungsvorgang deaktiviert." icon="hand-left-outline" />
                                        </div>
                                    </div>

                                    <Motion.AnimatePresence>
                                        {this.state.regInstance !== "" && this.state.regCodeSlot1 && this.state.regCodeSlot2 && this.state.regCodeSlot3 && (
                                            <Motion.motion.div
                                                initial={{opacity: 0, height: 0}}
                                                animate={{opacity: 1, height: "auto"}}
                                                exit={{opacity: 0, height: 0}}
                                            >
                                                <div className="input-group selector mb-3">
                                                    <ItemMultiSelect topic="Kurse"
                                                                     options={getDH("courses")
                                                                         .sort((a, b) => a.courseName.localeCompare(b.courseName))
                                                                         .map(course => {return {value: course.courseId, name: course.courseName}})}
                                                                     callback={(value) => {
                                                                         this.setState({regCourses: value, regState: ""})
                                                                     }}/>
                                                </div>

                                                <div>
                                                    <div className="input-group" data-index="1">
                                                        <input id="regFirstname" className="contentAuthInput form-control" type="text"
                                                               placeholder="Vorname" aria-label="name"
                                                               data-error={this.state.regState === "bad_credentials"}
                                                               onInput={e => {
                                                                   if (this.validRegisterName(e.currentTarget.value)) {
                                                                       e.currentTarget.setCustomValidity(this.validRegisterName(e.currentTarget.value))
                                                                       e.currentTarget.reportValidity()
                                                                       e.preventDefault()
                                                                       return
                                                                   }
                                                                   e.currentTarget.setCustomValidity("")
                                                               }}
                                                               onChange={e => {
                                                                   this.setState({
                                                                       regFirstname: e.target.value,
                                                                       regState: ""
                                                                   })
                                                               }}
                                                               onKeyDown={e => { if (e.keyCode === 13) $("#regLastname").focus()}} />
                                                        <input id="regLastname" className="contentAuthInput form-control" type="text"
                                                               placeholder="Nachname" aria-label="name"
                                                               data-error={this.state.loginState === "bad_credentials"}
                                                               onInput={e => {
                                                                   if (this.validRegisterName(e.currentTarget.value)) {
                                                                       e.currentTarget.setCustomValidity(this.validRegisterName(e.currentTarget.value))
                                                                       e.currentTarget.reportValidity()
                                                                       e.preventDefault()
                                                                       return
                                                                   }
                                                                   e.currentTarget.setCustomValidity("")
                                                               }}
                                                               onChange={e => {
                                                                   this.setState({
                                                                       regLastname: e.target.value,
                                                                       regState: ""
                                                                   })
                                                               }}
                                                               onKeyDown={e => { if (e.keyCode === 13) $("#regEmail").focus()}} />
                                                    </div>
                                                    <p className="ms-2 mt-1 pb-1" style={{color: "var(--sys-gray0)", fontWeight: "bold", fontSize: "9pt"}}>Kann später nicht geändert werden</p>

                                                    <div className="mt-3">
                                                        <input id="regEmail"  className="contentAuthInput form-control"
                                                               type="email" placeholder="E-Mail" aria-label="password"
                                                               required
                                                               data-error={this.state.regState === "bad_credentials"}
                                                               onChange={e => this.setState({
                                                                   regEmail: e.target.value,
                                                                   regState: ""
                                                               })}
                                                               onKeyDown={e => { if (e.keyCode === 13) $("#regPass").focus()}} />
                                                        <p className="ms-2 mt-1 pb-1" style={{color: "var(--sys-gray0)", fontWeight: "bold", fontSize: "9pt"}}>Schul- oder Privataddresse</p>
                                                    </div>

                                                    <div className="mt-3">
                                                        <input id="regPass"  className="contentAuthInput form-control"
                                                               type="password" placeholder="Passwort" aria-label="password"
                                                               data-error={this.state.regState === "bad_credentials"}
                                                               onInput={e => {
                                                                   if (e.currentTarget.value.length < 6) {
                                                                       e.currentTarget.setCustomValidity(`noch ${6-e.currentTarget.value.length} Zeichen`)
                                                                       e.currentTarget.reportValidity()
                                                                       e.preventDefault()
                                                                       return
                                                                   }
                                                                   e.currentTarget.setCustomValidity("")
                                                               }}
                                                               onChange={e => this.setState({
                                                                   regPassword: e.target.value,
                                                                   regState: ""
                                                               })}
                                                               onKeyDown={e => { if (e.keyCode === 13) this.register()}} />
                                                        <div className="d-flex align-items-center justify-content-between ms-2 me-1 mt-1 pb-1">
                                                            <p className="m-0" style={{color: "var(--sys-gray0)", fontWeight: "bold", fontSize: "9pt"}}>
                                                                Mindestens 6 Zeichen lang
                                                            </p>
                                                            <div className="d-flex align-items-start">
                                                                <div style={{height: "12px", width: "25px", backgroundColor: regPassStrength > 0 ? "var(--sys-red)" : "var(--sys-gray6)", borderRadius: "8px 0 0 8px"}} />
                                                                <div className="mx-1" style={{height: "12px", width: "25px", backgroundColor: regPassStrength > 1 ? "var(--sys-orange)" : "var(--sys-gray6)"}} />
                                                                <div style={{height: "12px", width: "25px", backgroundColor: regPassStrength > 3 ? "var(--sys-green)" : "var(--sys-gray6)", borderRadius: "0 8px 8px 0"}} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Motion.motion.div>
                                        )}
                                    </Motion.AnimatePresence>

                                    <div className="d-flex align-items-center justify-content-between pt-4">
                                        <button className="contentAuthButton" type="submit" onClick={() => this.setState({register: false})}
                                                style={{width: "30%", backgroundColor: "var(--sys-gray6)", color: "var(--sys-gray)"}}>
                                            Abbruch
                                        </button>
                                        <Motion.motion.button
                                            animate={{color: this.state.regState ? ["#fff", "#007aff", "#fff"] : "#fff"}}
                                            transition={{repeat: this.state.regState ? Infinity : false, duration: 2}}
                                            className="contentAuthButton d-flex align-items-center justify-content-center"
                                            type="submit" value="Login" onClick={() => this.register()}
                                            style={{width: "68%", backgroundColor: "var(--sys-blue)", color: "#fff"}}>
                                            {this.registerConfirmButtonElement()}
                                        </Motion.motion.button>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </>
        );
    }
}