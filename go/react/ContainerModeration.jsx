class ContainerModerationRoleAddElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addRolePopup: false,
            name: ""
        }
    }

    getLowestPowerLevel() {
        for (let i=1; i < 999; i++) if (getDH("roles").find(r => r.powerLvl === i) === undefined) return i;
    }

    add = async () => {
        // course has to be set
        if (this.state.name === "" || this.state.powerLvl === 0 || this.state.permissions === "") return;

        api("/student/role/add", "POST", JSON.stringify({
            "name": this.state.name,
            "hexColor": "#037bfc",
            "powerLvl": this.getLowestPowerLevel()
        }))
            .then(value => {
                this.setState({addRolePopup: false})
                let roles = getDH("roles")
                roles.push(value.data)
                modifyDataDH("roles", roles)
            })
    }

    render() {
        return (
            <>
                {this.state.addRolePopup ?
                    <Popup toggle={() => this.setState({addRolePopup: !this.state.addRolePopup})}>
                        <PPContent>
                            <PPHeadingIcon icon={"hammer-outline"} color="var(--sys-gray)"/>
                            <PPHeading>Rolle erstellen</PPHeading>
                            <PPInputText
                                placeholder="Name"
                                onValid={v => validateLength(v, 5, 150)}
                                onInput={v => this.setState({name: v})}
                                onEnter={this.add}
                            />
                        </PPContent>

                        <PPButton trigger={this.add} color="#fff" bgColor="var(--sys-blue)">Erstellen</PPButton>
                    </Popup>
                    : null}
                <Motion.motion.div
                    onClick={() => this.setState({addRolePopup: !this.state.addRolePopup})}
                    whileHover={{backgroundColor: "var(--sys-gray6)", color: "var(--sys-gray)"}}
                    className="mb-2 py-1 px-2 cursor-pointer d-flex justify-content-center"
                    style={{backgroundColor: "var(--sys-gray5)", color: "var(--sys-gray)", border: "1px solid var(--sys-gray)", borderRadius: "8px"}}>

                    <ion-icon name="add-outline" />
                </Motion.motion.div>
            </>
        );
    }
}

class ContainerModerationRole extends React.Component {
    constructor(props) {
        super(props);
        this.state = {deletionPopup: false}
    }

    changeColor = async (hexColor) => {
        if (!hasPermission(Permission.ROLE_CREATE)) return;

        api(`/student/role/${this.props.role.roleId}/color/${hexColor.replaceAll("#", '')}`,
            "POST", null)
            .then(value => {
                modifyDataDH("roles", getDH("roles").map(r => r.roleId === this.props.role.roleId
                    ? value.data : r))
            })
    }

    togglePermission = async (permissionId) => {
        let type = this.props.role.permissions.find(p => p === permissionId) === undefined ? "add" : "remove";

        api(`/student/role/${this.props.role.roleId}/permission/${type}/${permissionId}`,
            "POST", null)
            .then(value => {
                modifyDataDH("roles", getDH("roles").map(r => r.roleId === this.props.role.roleId
                    ? value.data : r))
            })
    }

    delete = async () => {
        api(`/student/role/${this.props.role.roleId}/delete`, "POST", null)
            .then(value => {
                console.debug(value.data)
                modifyDataDH("roles", value.data)
                this.setState({deletionPopup: false})
            })
    }

    render() {
        let canNotEdit = !this.props.role.configurable || !hasPermission(Permission.ROLE_EDIT)
            || !hasPowerLevel(this.props.role.powerLvl)

        return (
            <>
                {this.state.deletionPopup ?
                    <Popup toggle={() => this.setState({deletionPopup: false})}>
                        <PPContent>
                            <PPHeadingIcon icon={"trash-outline"} color={"var(--sys-red)"} />
                            <PPHeading>Rolle Löschen</PPHeading>
                            <PPDescription>
                                Möchtest du die Rolle <strong>{this.props.role.name}</strong> wirklich endgültig
                                löschen und allen Personen mit dieser Rolle die gegebenen Berechtigungen entziehen?
                            </PPDescription>
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
                    :
                    null
                }
                <div className="roundContainer pb-3">
                    <div className="roundContainerInner">
                        <div className="d-flex justify-content-between pb-2">
                            <h5 className="fw-bold">{this.props.role.name}</h5>
                            <Motion.motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                key={this.props.role.roleId}
                                className="d-flex align-items-center">
                                {this.props.role.configurable ?
                                    hasPermission(Permission.ROLE_EDIT) && hasPowerLevel(this.props.role.powerLvl) ?
                                        null
                                        :
                                        <>
                                            <p className="m-0 pe-2"
                                               style={{fontSize: "9pt", fontWeight: "bold", color: "var(--sys-gray)"}}>
                                                Nur Lesen
                                            </p>
                                            <ion-icon name="alert-circle" />
                                        </>
                                    :
                                    <>
                                        <p className="m-0 pe-2"
                                           style={{fontSize: "9pt", fontWeight: "bold", color: "var(--sys-gray)"}}>
                                            Nicht konfigurierbar
                                        </p>
                                        <ion-icon name="alert-circle" />
                                    </>
                                }
                            </Motion.motion.div>
                        </div>
                        <div className="roundContainerInner mb-3" style={{backgroundColor: "var(--sys-gray5)"}}>
                            <p className="m-0" style={{fontSize: "13pt", fontWeight: "550"}}>Farbe</p>
                            <p className="mb-1" style={{fontSize: "11pt", color: "var(--sys-gray)"}}>
                                Wähle eine Farbe mit der die Rolle angezeigt wird.
                            </p>
                            <ItemColorSelection color={this.props.role.hexColor}
                                                disabled={canNotEdit}
                                                trigger={(val) => this.changeColor(val)}/>
                        </div>
                        <div className="roundContainerInner mb-3" style={{backgroundColor: "var(--sys-gray5)"}}>
                            <div className="d-flex align-items-center justify-content-between">
                                <p className="m-0" style={{fontSize: "13pt", fontWeight: "550"}}>Personen</p>
                                <p className="m-0" style={{fontSize: "13pt", fontWeight: "550", color: "var(--sys-gray)"}}>
                                    {getDH("students").filter(s => s.roles.includes(this.props.role.roleId)).length}
                                </p>
                            </div>
                            <p className="mb-1" style={{fontSize: "11pt", color: "var(--sys-gray)"}}>
                                Diese Personen haben alle Berechtigungen der Rolle {this.props.role.name}
                            </p>
                            <div className="d-flex flex-wrap">
                                {getDH("students").filter(s => s.roles.includes(this.props.role.roleId)).map(student => {
                                    return <div key={student.studentId} style={{padding: "2px"}}><ItemAvatar size="32px" /></div>
                                })}
                            </div>
                        </div>
                        <div className="roundContainerInner mb-3" style={{backgroundColor: "var(--sys-gray5)"}}>
                            <p className="mb-2" style={{fontSize: "14pt", fontWeight: "550"}}>Berechtigungen</p>
                            <div>
                                {getDH("permissions").sort((a, b) => a.name.localeCompare(b.name)).map(permission => {
                                    let checked = this.props.role.permissions.find(p => p === permission.permissionId) !== undefined;
                                    return <div key={permission.permissionId + this.props.role.roleId}
                                                className="d-flex justify-content-between align-items-center my-1 py-2" style={{borderTop: "1px solid var(--sys-gray4)"}}>
                                        <div>
                                            <p className="m-0" style={{fontSize: "12pt", fontWeight: "550"}}>
                                                {permission.title}
                                            </p>
                                            <p className="mb-1" style={{fontSize: "11pt", color: "var(--sys-gray)"}}>
                                                {permission.description}
                                            </p>
                                        </div>
                                        <ItemSwitch checked={checked}
                                                    trigger={() => this.togglePermission(permission.permissionId)}
                                                    disabled={canNotEdit} />
                                    </div>
                                })
                                }
                            </div>
                        </div>
                        <div className="roundContainerInner" style={{backgroundColor: "var(--sys-gray5)"}}>
                            <p className="m-0" style={{fontSize: "13pt", fontWeight: "550"}}>Löschen</p>
                            <div className="d-flex justify-content-between">
                                <p className="m-0" style={{fontSize: "11pt", color: "var(--sys-gray)"}}>
                                    Mit der Löschung dieser Rolle verlieren alle Personen ausgestattet mit der Rolle diese
                                    Berechtigungen.
                                </p>
                                <button id="deleteButton" style={{borderRadius: "10px", backgroundColor: "var(--sys-red)"}}
                                        className="btn btn-danger" disabled={canNotEdit}
                                        onClick={() => this.setState({deletionPopup: !this.state.deletionPopup})}>
                                    Löschen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

class ContainerModeration extends React.Component {
    constructor(props) {
        super(props);
        this.interval = null;

        this.state = {
            error: false,
            selectedRoleId: props.roles[0].roleId,
            addRolePopup: false
        }
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { error: true };
    }

    render() {
        if (this.state.error) return <ContainerLoader height="100%" message="Etwas ist schiefgelaufen" />
        if (this.props.roles.find(r => r.roleId === this.state.selectedRoleId) === undefined) this.setState({selectedRoleId: this.props.roles[0].roleId})

        return <div className="d-md-flex h-100">
            <div className="col-12 col-md-3">
                <div className="roundContainer">
                    <div className="roundContainerInner">
                        {this.props.roles.sort((a, b) => b.powerLvl - a.powerLvl).map(role => {
                            return  <Motion.motion.div
                                key={role.roleId}
                                onClick={() => {this.setState({selectedRoleId: role.roleId})}}
                                whileHover={{backgroundColor: "var(--sys-gray4)", color: "var(--sys-gray)"}}
                                className="mb-2 p-2 cursor-pointer d-flex justify-content-between"
                                style={{backgroundColor: "var(--sys-gray5)", color: "var(--sys-gray5)", borderRadius: "8px"}}>

                                <p className="m-0" style={{fontWeight: "550", color: "var(--sys-black)"}}>{role.name}</p>
                                <ion-icon name="menu-outline" style={{color: "currentColor"}} />
                            </Motion.motion.div>
                        })
                        }
                        {hasPermission(Permission.ROLE_CREATE) ?
                            <ContainerModerationRoleAddElement />
                            :
                            null
                        }
                    </div>
                </div>
            </div>
            <div className={`col-12 col-md-9 overflow-scroll ${window.innerWidth > 710 ? "h-100" : ""}`}>
                <ContainerModerationRole role={this.props.roles.find(r => r.roleId === this.state.selectedRoleId)} />
            </div>
        </div>
    }
}

class ContentModeration extends React.Component {
    constructor() {
        super();

        this.interval = setInterval(() => {if (DHUpdated) { this.setState({age: this.state.age++}); DHUpdated = false}}, 100)
        this.state = {age: 0}
    }
    componentWillUnmount() {clearInterval(this.interval)}

    render() {
        return (
            <ContentHolder>
                <CHHeading>
                    <ActionBar>
                        <ABButton icon={""} key={""} trigger={() => {}}/>
                    </ActionBar>

                    <Header title={"Moderation"} color={"var(--sys-red)"} />
                </CHHeading>
                <CHBody>
                    <ContainerModeration roles={getDH("roles")} />
                </CHBody>
            </ContentHolder>
        );
    }
}