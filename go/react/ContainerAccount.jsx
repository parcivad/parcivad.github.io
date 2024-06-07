 class ContainerAccountDangerZone extends React.Component {
    constructor() {
        super();

        this.state = {
            deletionPopup: false
        }
    }

    toggleDeletePopup = () => this.setState({deletionPopup: !this.state.deletionPopup})

    delete = async () => {
        await api(`/student/${getDH("identity").studentId}/delete`, "POST", null);
        logout();
    }

    render() {
        return (
            <>
                {this.state.deletionPopup ?
                    <Popup toggle={() => this.setState({deletionPopup: false})}>
                        <PPContent>
                            <PPHeadingIcon icon={"warning-outline"} color={"var(--sys-red)"} />
                            <PPHeading>Konto Löschen</PPHeading>
                            <PPDescription>
                                Möchtest du wirklich dein Konto und alle gesammelten Daten endgültig löschen? Einstellungen, wie
                                deine Kurse, lassen sich nicht wiederherstellen!
                            </PPDescription>
                            <div className={"pt-2"}>
                                <PPDescription>
                                    Kontoinhaber: <mark>{getDH("identity").name.firstname} {getDH("identity").name.lastname}</mark>
                                </PPDescription>
                            </div>
                        </PPContent>

                        <PPButton
                            trigger={() => this.setState({deletionPopup: false})}
                            color={"var(--sys-black)"}
                            bgColor={"var(--sys-gray6)"}
                        >
                            Abbruch
                        </PPButton>
                        <PPButton
                            trigger={this.delete}
                            color={"#fff"}
                            bgColor={"var(--sys-red)"}
                        >
                            Löschen
                        </PPButton>
                    </Popup>

                    : null}

                <DangerZone>
                    <DZTitle>💣 Achtung explosiv</DZTitle>
                    <DZItems>
                        <DZItem
                            title="Konto löschen"
                            description="Lösche dein Konto und kündige alle Dienste."
                            buttonText="Löschen"
                            trigger={this.toggleDeletePopup} />
                    </DZItems>
                </DangerZone>
            </>
        );
    }
}

class ContainerAccountCourses extends React.Component {
    toggle(value) {
        this.props.callback(value)
    }

    render() {
        return (
            <Motion.motion.div
                style={{maxHeight: 250}}
                className="overflow-scroll mt-1"
                initial={{opacity: 0, height: 0}}
                animate={{opacity: 1, height: "auto"}}
                exit={{opacity: 0, height: 0}}
            >
                {this.props.options.map(option => {
                    return <div className="d-flex align-items-center justify-content-between py-2" key={option.value}>
                        <p className="m-0" style={{fontSize: "11pt"}}>
                            {option.name}
                        </p>
                        <ItemSwitch checked={option.checked} trigger={() => this.toggle(option.value)} />
                    </div>
                })}
            </Motion.motion.div>
        );
    }
}

class ContainerAccountSettingsBlock extends React.Component {
    render() {
        return (
            <div className="roundContainer h-100">
                <div className="roundContainerInner h-100">
                    <div className="d-flex justify-content-between">
                        <p style={{fontWeight: 550}}>{this.props.title}</p>
                        <p style={{fontWeight: 550, color: "var(--sys-gray)"}}>{this.props.description}</p>
                    </div>
                    <div className="mx-1" style={{backgroundColor: "var(--sys-gray6)", borderRadius: "8px"}} >
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

class ContainerAccountSettingsSwitch extends React.Component {
    render() {
        return (
            <div className="d-flex align-items-center justify-content-between">
                <div className="col-10">
                    <p className="m-0" style={{fontSize: "11pt"}}>
                        {this.props.title}
                    </p>
                    <p className="m-0" style={{fontSize: "10pt", color: "var(--sys-gray)"}}>
                        {this.props.description}
                    </p>
                </div>
                <div className="col-2 d-flex justify-content-end align-items-center">
                    <ItemSwitch checked={this.props.checked}
                                trigger={this.props.trigger}/>
                </div>
            </div>
        );
    }
}

class ContainerAccountSettingsInput extends React.Component {
    render() {
        return (
            <div className="d-flex align-items-center justify-content-between">
                <div className="col-7">
                    <p className="m-0" style={{fontSize: "11pt"}}>
                        {this.props.title}
                    </p>
                    <p className="m-0" style={{fontSize: "10pt", color: "var(--sys-gray)"}}>
                        {this.props.description}
                    </p>
                </div>
                <div className="col-5 d-flex justify-content-end align-items-center">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

class ContainerAccount extends React.Component {
    constructor(props) {
        super(props);
        this.interval = null;

        this.state = {
            error: false,
            nickname: this.props.identity.nickname,
            birthday: this.props.identity.birthday
        }
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { error: true };
    }

    async setNickname(name){
        if (name === "") name = "null"
        return api(`/student/nickname/${name}`, "POST", null)
            .then(value => modifyDataDH("identity", value.data))
    }

    async setBirthday(date) {
        return api(`/student/birthday/${date}`, "POST", null)
            .then(value => modifyDataDH("identity", value.data))
    }

    async toggleCourse(courseId) {
        return api(`/student/${getDH("identity").studentId}/course/${getDH("identity").courses.find(c => c === courseId) !== undefined ? "remove" : "add"}/${courseId}`, "POST", null)
            .then(value => modifyDataDH("identity", value.data))
    }

    async toggleCalendarSettings(alarm, emoji) {
        return api(`/student/calendar`, "POST", JSON.stringify({
            "name": getDH("calendar").name,
            "alarm": alarm,
            "emoji": emoji
        })).then(value => modifyDataDH("calendar", value.data))
    }

    render() {
        if (this.state.error) return <ContainerLoader height="100%" message="Etwas ist schiefgelaufen" />

        return <div className="col-12 d-flex justify-content-center pt-2">
            <div className="col-12 col-sm-10">
                <div className="row row-cols-2 px-2">
                    <div className="col-12 my-2">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                <ItemAvatar size="72px" />
                                <div className="ps-2">
                                    <p className="m-0" style={{fontSize: "17pt"}}>{this.props.identity.name.firstname} {this.props.identity.name.lastname}</p>
                                    <p className="m-0" style={{color: "var(--sys-gray)", fontWeight: 550}}>
                                        {this.props.identity.email}
                                    </p>
                                </div>
                            </div>
                            <div className="text-end">
                                <ItemTextButton trigger={() => {}} text="Avatar ändern" weight={550} />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 p-0" style={{minHeight: "220px"}}>
                        <ContainerAccountSettingsBlock title="Deine Profile">
                            <ContainerAccountSettingsInput title="Spitzname" description="Wird auf deinem Profil angezeigt.">
                                <input className="createInput mt-2" placeholder="Spitzname" type="text" style={{backgroundColor: "var(--sys-gray5)"}}
                                       value={this.state.nickname === null ? "" : this.state.nickname}
                                       onInput={e=> this.setState({nickname: e.currentTarget.value})}
                                />
                            </ContainerAccountSettingsInput>
                            <div className="spacer my-2" />
                            <ContainerAccountSettingsInput title="Geburtstag" description="Wird verkündet und angezeigt.">
                                <input id="aS2" style={{backgroundColor: "var(--sys-gray5)", whiteSpace: "nowrap"}}
                                       className="createInput"
                                       value={this.state.birthday !== '1970-01-01T00:00:00.000+00:00' ? `${new Date(this.state.birthday).getFullYear()}-${("0" + (new Date(this.state.birthday).getMonth()+1)).slice(-2)}-${("0" + new Date(this.state.birthday).getDate()).slice(-2)}`: null} type="date"
                                       onInput={e => this.setState({birthday: new Date(e.currentTarget.value)})} />
                            </ContainerAccountSettingsInput>
                            <button className="profileSaveButton mt-2 mb-1" type="button"
                                    onClick={() => {
                                        if (this.props.identity.nickname !== this.state.nickname)
                                            this.setNickname(this.state.nickname)
                                        if (this.props.identity.birthday !== this.state.birthday)
                                            this.setBirthday(this.state.birthday)
                                    }}
                                    disabled={this.props.identity.nickname === this.state.nickname
                                        && this.props.identity.birthday === this.state.birthday}
                            >
                                Speichern
                            </button>
                        </ContainerAccountSettingsBlock>
                    </div>
                    <div className="col-12 col-md-6 p-0" style={{minHeight: "220px"}}>
                        <ContainerAccountSettingsBlock title="Kalender Einstellungen">
                            <ContainerAccountSettingsSwitch
                                title="Emojis"
                                description="Stichwörter, wie Entfall oder Änderung, werden durch einen Emoji ersetzt."
                                checked={getDH("calendar").emoji}
                                trigger={() => this.toggleCalendarSettings(getDH("calendar").alarm, !getDH("calendar").emoji)}
                            />
                            <div className="spacer my-2" style={{backgroundColor: "var(--sys-gray5)"}} />
                            <ContainerAccountSettingsSwitch
                                title="Hinweise"
                                description="Alle Termine werden mit einem Hinweis gesendet."
                                checked={getDH("calendar").alarm}
                                trigger={() => this.toggleCalendarSettings(!getDH("calendar").alarm, getDH("calendar").emoji)}
                            />
                        </ContainerAccountSettingsBlock>
                    </div>
                    <div className="col-12 col-md-8 p-0" style={{minHeight: "260px"}}>
                        <ContainerAccountSettingsBlock
                            title="Deine Kurse"
                            description={`${getDH("identity").courses.length}/${getDH("courses").length}`}
                        >
                            <ContainerAccountCourses
                                options={getDH("courses")
                                    .sort((a, b) => a.courseName.localeCompare(b.courseName))
                                    .map(course => {
                                        return {
                                            value: course.courseId,
                                            name: course.courseName,
                                            checked: getDH("identity").courses.find(c => c === course.courseId) !== undefined
                                        }
                                    })}
                                callback={(value) => {
                                    this.toggleCourse(value)
                                }}
                            />
                        </ContainerAccountSettingsBlock>
                    </div>
                    <div className="col-12 col-md-4 p-0" style={{minHeight: "260px"}}>
                        <ContainerAccountSettingsBlock title="Rechtliches">
                            <div className="roundContainer">
                                <div className="roundContainerInner d-flex justify-content-between align-items-center cursor-pointer"
                                     style={{backgroundColor: "var(--sys-gray5)"}}
                                     onClick={() => window.open("/datenschutzerklärung.html")}>
                                    <p className="m-0" style={{fontSize: "11pt", fontWeight: "500"}}>Datenschutzerklärung</p>
                                    <ion-icon name="arrow-up-outline" style={{color: "var(--sys-black)", rotate: "45deg"}}/>
                                </div>
                            </div>
                            <div className="roundContainer">
                                <div className="roundContainerInner d-flex justify-content-between align-items-center cursor-pointer"
                                     style={{backgroundColor: "var(--sys-gray5)"}}
                                     onClick={() => window.open("/nutzungsbedingungen.html")}>
                                    <p className="m-0" style={{fontSize: "11pt", fontWeight: "500"}}>Nutzungsbedingungen</p>
                                    <ion-icon name="arrow-up-outline" style={{color: "var(--sys-black)", rotate: "45deg"}}/>
                                </div>
                            </div>
                            <div className="roundContainer">
                                <div className="roundContainerInner d-flex justify-content-between align-items-center cursor-pointer"
                                     style={{backgroundColor: "var(--sys-gray5)"}}
                                     onClick={() => window.open("/cookies.html")}>
                                    <p className="m-0" style={{fontSize: "11pt", fontWeight: "500"}}>Cookie-Richtlinie</p>
                                    <ion-icon name="arrow-up-outline" style={{color: "var(--sys-black)", rotate: "45deg"}}/>
                                </div>
                            </div>
                            <div className="roundContainer">
                                <div className="roundContainerInner d-flex justify-content-between align-items-center cursor-pointer"
                                     style={{backgroundColor: "var(--sys-gray5)"}}
                                     onClick={() => window.open("/impressum.html")}>
                                    <p className="m-0" style={{fontSize: "11pt", fontWeight: "500"}}>Impressum</p>
                                    <ion-icon name="arrow-up-outline" style={{color: "var(--sys-black)", rotate: "45deg"}}/>
                                </div>
                            </div>
                        </ContainerAccountSettingsBlock>
                    </div>
                </div>

                <div className="my-2"/>
                <ContainerAccountDangerZone />
            </div>
        </div>
    }
}

class ContentAccount extends React.Component {
    constructor(props) {
        super(props);

        this.interval = setInterval(() => {if (DHUpdated) { this.setState({age: this.state.age++}); DHUpdated = false}}, 100)
        this.state = {age: 0}
    }
    componentWillUnmount() {clearInterval(this.interval)}

    render() {
        return (
            <ContentHolder>
                <CHHeading>
                    <ActionBar>
                        <ABButton key="0" icon="log-out-outline" trigger={() => OAuthProcessRequired()}/>
                    </ActionBar>

                    <Header title="Konto" color="var(--sys-black)"></Header>
                </CHHeading>
                <CHBody>
                    <ContainerAccount identity={getDH("identity")} />
                </CHBody>
            </ContentHolder>
        );
    }
}