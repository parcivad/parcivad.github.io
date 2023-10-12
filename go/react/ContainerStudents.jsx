class ContainerStudentsElementRoleAddBadge extends React.Component {
    constructor(props) {
        super(props);

        this.state = {roleId: ""}
    }

    add = () => {
        if (this.state.roleId === "") return;

        api(`/student/${this.props.studentId}/role/add/${this.state.roleId}`, "POST", null)
            .then(value => {
                modifyDataDH("students", value.data)
            })
    }

    render() {
        return (
            <div
                 className="d-flex align-items-center m-1 p-1 cursor-pointer"
                 style={{backgroundColor: "var(--sys-gray5)", borderRadius: "8px"}}>
                <select className="role-add-select" value={this.state.roleId}
                        onChange={e => {this.setState({roleId: e.target.value})}} >
                    <option value="" selected={true} disabled={true}>Rolle hinzufügen</option>
                    {getDH("roles").map(role => {
                        return <option value={role.roleId} key={role.roleId}
                                       disabled={!role.configurable || !hasPowerLevel(role.powerLvl)}>
                            {!role.configurable || !hasPowerLevel(role.powerLvl) ? "🔒"+ role.name: role.name}
                        </option>
                    })}
                </select>
                <ion-icon onClick={this.add}
                          style={{paddingLeft: "10px", fontSize: "14pt", color: "var(--sys-black)"}} name="add-circle-outline" />
            </div>
        );
    }
}

class ContainerStudentsElementRoleBadge extends React.Component {
    remove = () => {
        if (!hasPermission(Permission.STUDENT_ROLE_REMOVE)) return;

        api(`/student/${this.props.studentId}/role/remove/${this.props.roleId}`, "POST", null)
            .then(value => {
                modifyDataDH("students", value.data)
            })
    }

    render() {
        let role = getDH("roles").find(role => role.roleId === this.props.roleId)

        return (
            <div onClick={this.remove}
                className="d-flex align-items-center m-1 p-1 cursor-pointer"
                style={{backgroundColor: role.hexColor, borderRadius: "8px", color: "#fff", lineHeight: 0}}>
                {role.name}
                <ion-icon style={{fontSize: "14pt", color: "#fff"}}
                          name={
                              hasPermission(Permission.STUDENT_ROLE_REMOVE) ?
                                  role.configurable ? "close-outline" : "lock-closed-outline"
                                  : " "} />
            </div>
        );
    }
}

class ContainerStudentsElement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            detailsPopup: false,
            identity: null,
            error: false
        };
    }

    componentDidMount() {
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return {error: true};
    }

    fetchIdentity() {
        api(`/student/${this.props.studentId}/identity`, "GET", null)
            .then(value => {
                this.setState({
                    identity: value.data
                })
                return value;
            })
            .catch(error => this.setState({error: true}))
    }

    delete = async () => {
        if (confirm(`Möchtest du wirklich ${this.props.student.name.firstname} ${this.props.student.name.lastname} endgültig löschen`))
            api(`/student/${this.props.studentId}/delete`, "POST", null)
                .then(value => {
                    this.setState({detailsPopup: false})
                    modifyDataDH("students", value.data)
                }).catch(error => this.setState({error: true}))
    }

    render()  {
        if (hasPermission(Permission.STUDENT_IDENTITY_OTHER) && this.state.detailsPopup &&
            this.state.identity === null) this.fetchIdentity();

        return (
            <>
                {this.state.detailsPopup ?
                    <Popup toggle={() => this.setState({detailsPopup: !this.state.detailsPopup})}>
                        <PPContent>
                            <div className="d-flex justify-content-center w-100 py-2">
                                <ItemAvatar size="64px" />
                            </div>
                            <PPHeading>{this.props.student.name.firstname} {this.props.student.name.lastname}</PPHeading>
                            <div className="d-flex justify-content-center">
                                <div className="row row-cols-2 d-flex text-start">
                                    {hasPermission(Permission.STUDENT_IDENTITY_OTHER) ?
                                        this.state.identity !== null ?
                                            <>
                                                <div className="col-3 text-end">
                                                    <ion-icon name="mail-outline"></ion-icon>
                                                </div>
                                                <p className="col-7 text-start"
                                                   style={{color: "var(--sys-gray)"}}>
                                                    {this.state.identity.email}
                                                </p>

                                                <div className="col-3 text-end">
                                                    <ion-icon name="school-outline"></ion-icon>
                                                </div>
                                                <p className="col-7 text-start"
                                                   style={{color: "var(--sys-gray)"}}>
                                                    TODO: Build in instances
                                                </p>

                                                <div className="col-3 text-end">
                                                    <ion-icon name="file-tray-stacked-outline"></ion-icon>
                                                </div>
                                                <div className="col-7 d-flex flex-wrap"
                                                   style={{color: "var(--sys-gray)"}}>
                                                    {this.state.identity.courses.map(courseId => {
                                                        return <Motion.motion.div
                                                            key={courseId}

                                                            whileHover={{
                                                                color: "var(--sys-black)"
                                                            }}
                                                            className="d-flex align-items-center mx-1 mb-1 p-1 cursor-pointer"
                                                            style={{backgroundColor: "var(--sys-gray6)", borderRadius: "8px", lineHeight: 0}}>
                                                            {getDH("courses").find(course => course.courseId === courseId).courseName}
                                                            <ion-icon style={{fontSize: "14pt", color: "currentColor"}}
                                                                      name="close-odutline" />
                                                        </Motion.motion.div>
                                                    })}
                                                </div>

                                                <div className="col-3 text-end mt-1 pt-2">
                                                    <ion-icon name="accessibility-outline"></ion-icon>
                                                </div>
                                                <div className="col-7 d-flex flex-wrap pt-2"
                                                     style={{color: "var(--sys-gray)"}}>
                                                    {this.props.student.roles.map(roleId => {
                                                        return <ContainerStudentsElementRoleBadge
                                                            key={roleId}
                                                            studentId={this.props.studentId}
                                                            roleId={roleId}/>
                                                    })}
                                                    <ContainerStudentsElementRoleAddBadge
                                                        studentId={this.props.studentId} />
                                                </div>

                                                <div className="col-3 text-end">
                                                    <ion-icon name="refresh-outline"></ion-icon>
                                                </div>
                                                <p className="col-7 text-start"
                                                   style={{color: "var(--sys-gray)"}}>
                                                    {timeToStringDetail(new Date(this.state.identity.lastAccess))}
                                                </p>
                                            </>
                                            :
                                            this.state.error ?
                                                <ContainerLoader height="100%" message="Etwas ist schiefgelaufen" />
                                                :
                                                <ContainerLoader height="100%" message="Identität lädt..." />
                                        :
                                        <>
                                            <div className="col-3 text-end">
                                                <ion-icon name="school-outline"></ion-icon>
                                            </div>
                                            <p className="col-7 text-start"
                                               style={{color: "var(--sys-gray)"}}>
                                                TODO: Build in instances
                                            </p>

                                            <div className="col-3 text-end">
                                                <ion-icon name="accessibility-outline"></ion-icon>
                                            </div>
                                            <div className="col-7 d-flex flex-wrap"
                                               style={{color: "var(--sys-gray)"}}>
                                                {this.props.student.roles.map(roleId => {
                                                    return <ContainerStudentsElementRoleBadge
                                                        key={roleId}
                                                        studentId={this.props.studentId}
                                                        roleId={roleId} />
                                                })}
                                            </div>
                                        </>
                                    }

                                </div>
                            </div>
                        </PPContent>

                        <PPButton trigger={() => {}} color="#fff" bgColor="var(--sys-blue)">Kommentare öffnen</PPButton>
                        {hasPermission(Permission.STUDENT_DELETE_OTHER) ?
                            <PPButton trigger={this.delete} color="#fff" bgColor="var(--sys-red)">Konto Löschen</PPButton>
                            : null
                        }
                    </Popup>
                    :
                    null
                }
                <Motion.motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{
                        delay: this.props.delay,
                        ease: "easeOut"
                    }}
                >
                    <div className="col-12 student">
                        <div className="row row-cols-2 cursor-pointer"
                             onClick={() => this.setState({detailsPopup: !this.state.detailsPopup})}>
                            <div className="col-8 col-md-7 d-flex align-items-center">
                                <div className="pe-2">
                                    <ItemAvatar size="34px" />
                                </div>
                                <div>
                                    <p className="m-0" style={{fontSize: "12pt", fontWeight: "bold",
                                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                                        {this.props.student.name.firstname} {this.props.student.name.lastname}
                                    </p>
                                    <p className="m-0" style={{fontSize: "11pt", color: "var(--sys-gray)",
                                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                                        {this.props.student.nickname}
                                    </p>
                                </div>
                            </div>
                            <div className="col-4 col-md-5 d-flex overflow-scroll" style={{maxHeight: "25px"}}>
                                {
                                    this.props.student.roles.map(roleId => {
                                        let role = getDH("roles").find(role => role.roleId === roleId);
                                        return <div className="ms-1 p-1 fw-bold"
                                                    key={roleId}
                                                    style={{fontSize: "10pt", color: "#fff", backgroundColor: role.hexColor, borderRadius: "4px"}}>
                                            {role.name}
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </Motion.motion.div>
            </>
        );
    }
}

class ContainerStudents extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: false
        }
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { error: true };
    }

    render() {

        let studentElements = [];
        let delay = 0.1;
        getDH("students").filter(student =>
            (student.name.firstname + student.name.lastname).toUpperCase().includes(this.props.search.toUpperCase())
            || student.roles.includes(this.props.search))
            .sort((a, b) => a.name.firstname.localeCompare(b.name.firstname)).forEach(student => {
            studentElements.push(
                <ContainerStudentsElement
                    delay={delay}
                    key={student.studentId}
                    studentId={student.studentId}
                    student={student}
                />)
            if (delay < 2) delay *= 1.1;
        });

        if (studentElements.length === 0 && this.props.search) return <ContainerInformationBanner
            title={`Kein Schüler mit "${this.props.search}" gefunden`}
            description={"Ändere deine Eingabe, um ein passenden Schüler zu finden."}
            icon={"person-outline"}
            color={"gray"}
        />

        if (studentElements.length === 0) return <ContainerInformationBanner
            title={`Keine Schüler gefunden`}
            description={"Etwas ist schiefgelaufen"}
            icon={"person-outline"}
            color={"gray"}
        />

        return (studentElements);
    }
}

class ContentStudents extends React.Component {
    constructor(props) {
        super(props);

        this.interval = setInterval(() => {if (DHUpdated) { this.setState({age: this.state.age++}); DHUpdated = false}}, 100)
        this.state = {
            title: "Alle Schüler",
            color: "var(--sys-blue)",
            searchText: "",
            age: 0
        }
    }
    componentWillUnmount() {clearInterval(this.interval)}

    setSearchText = (val) => this.setState({title: val ? "Gefundene Schüler" : "Alle Schüler", searchText: val})

    render() {
        return (
            <ContentHolder>
                <CHHeading>
                    <ActionBar>
                        <ABSearchBar key="1" trigger={this.setSearchText} placeholder="Suchen" />
                    </ActionBar>

                    <Header title={`${this.state.searchText ? "Gefundene Schüler" : "Alle Schüler"} • ${getDH("students").length}`}
                            color={this.state.color} />
                </CHHeading>
                <CHBody>
                    <ContainerStudents students={getDH("students")}
                                       search={this.state.searchText}/>
                </CHBody>
            </ContentHolder>
        );
    }
}