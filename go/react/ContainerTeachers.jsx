class ContainerTeachersAddPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {firstname: "", lastname: "", email: ""}
    }

    addTeacher = async () => {
        api(`/student/teacher/add`, "POST", JSON.stringify({
            email: this.state.email,
            name: {
                firstname: this.state.firstname,
                lastname: this.state.lastname
            }
        }))
            .then(value => {
                modifyDataDH("teachers", value.data)
                this.props.toggle()
            })
            .catch(error => { return error })
    }

    render() {
        return (
            <Popup toggle={() => this.props.toggle()}>
                <PPContent>
                    <PPHeadingIcon icon={"add-circle-outline"} color={"var(--sys-gray)"}/>
                    <PPHeading>Lehrer hinzufügen</PPHeading>
                    <PPDescription>Füge ein Lehrer aus eurem Kollegium in Classync, um ihn in Rankings oder Kommentaren zu benutzen.</PPDescription>
                    <PPInputText
                        placeholder="Vorname"
                        onValid={v => validateLength(v, 1, 150)}
                        onInput={v => this.setState({firstname: v})}
                        onEnter={() => $("#tec2").focus()}
                    />
                    <PPInputText
                        id="tec2"
                        placeholder="Nachname"
                        onValid={v => validateLength(v, 1, 150)}
                        onInput={v => this.setState({lastname: v})}
                        onEnter={() => $("#tec3").focus()}
                    />
                    <PPInputText
                        id="tec3"
                        placeholder="E-Mail"
                        onValid={v => validateEmail(v)}
                        onInput={v => this.setState({email: v})}
                        onEnter={this.addTeacher}
                    />
                </PPContent>

                <PPButton trigger={this.addTeacher} disabled={validateLength(this.state.firstname, 1, 150)
                    || validateLength(this.state.lastname, 1, 150) || validateEmail(this.state.email)}
                          color="#fff" bgColor="var(--sys-blue)">Hinzufügen</PPButton>
            </Popup>
        );
    }
}

class ContainerTeachersElement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            deletionPopup: false,
            identity: null,
            error: false
        };
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return {error: true};
    }

    delete = async () => {
        api(`/student/teacher/${this.props.teacher.teacherId}/delete`, "POST", null)
            .then(value => {
                this.setState({detailsPopup: false})
                modifyDataDH("teachers", value.data)
            }).catch(error => this.setState({error: true}))
    }

    render()  {
        return (
            <>
                {this.state.deletionPopup ?
                    <Popup toggle={() => this.setState({deletionPopup: !this.state.deletionPopup})}>
                        <PPContent>
                            <div className="d-flex justify-content-center w-100 py-2">
                                <ItemAvatar size="64px" />
                            </div>
                            <PPHeading>{this.props.teacher.name.firstname} {this.props.teacher.name.lastname}</PPHeading>
                            <PPDescription>
                                Möchtest du den eingerichteten Lehrer {this.props.teacher.name.firstname} {this.props.teacher.name.lastname} wirklich
                                endgültig löschen? Alle Rankings und Kommentare werden dabei auch gelöscht!
                            </PPDescription>
                        </PPContent>
                        <PPButton trigger={this.delete} color="#fff" bgColor="var(--sys-red)">Konto Löschen</PPButton>
                    </Popup>
                    :
                    null
                }
                <Motion.motion.div
                    initial={{y: 15, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{delay: this.props.delay}}
                    className="col-6 col-md-4 col-xl-3 roundContainer">
                    <div className="roundContainerInner d-flex flex-column align-items-center">
                        <ItemAvatar size="64px" />
                        <h5 className="pt-3">{this.props.teacher.name.firstname} {this.props.teacher.name.lastname}</h5>
                        <div className="d-flex justify-content-center w-100">
                            <a href={`mailto:${this.props.teacher.email}`}>
                                <Motion.motion.div
                                    initial={{color: "var(--sys-gray)"}}
                                    whileHover={{color: "var(--sys-black)"}}
                                    className="d-flex cursor-pointer">
                                    <ion-icon name="mail-outline"
                                              style={{fontSize: "15pt", padding: "4px",
                                                  borderRadius: "100%",
                                                  backgroundColor: "var(--sys-gray5)", color: "currentColor"}} />
                                </Motion.motion.div>
                            </a>
                            {hasPermission(Permission.TEACHER_DELETE) ?
                                <Motion.motion.div
                                    onClick={() => this.setState({deletionPopup: !this.state.deletionPopup})}
                                    initial={{color: "var(--sys-gray)"}}
                                    whileHover={{color: "var(--sys-red)"}}
                                    className="d-flex cursor-pointer ps-2">
                                    <ion-icon name="trash-outline"
                                              style={{fontSize: "15pt", padding: "4px",
                                                  borderRadius: "100%",
                                                  backgroundColor: "var(--sys-gray5)", color: "currentColor"}} />
                                </Motion.motion.div>
                                :
                                null
                            }
                        </div>
                    </div>
                </Motion.motion.div>
            </>
        );
    }
}

class ContainerTeachers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            suspended: false,
            error: false
        }
    }

    render() {
        if (this.props.teachers === null) return <ContainerLoader height="90%" message=""/>

        if (this.props.teachers.length === 0) return <>
            {this.props.addPopup ? <ContainerTeachersAddPopup toggle={this.props.toggleAddPopup} /> : null}
            <ContainerInformationBanner
                title={`Keine Lehrer gefunden`}
                description={"Es wurden noch keine Lehrer angelegt, um einen neuen Lehrer zu erstellen klicke auf das Plus."}
                icon={"person-outline"}
                color={"gray"}/>
        </>

        let teacherElements = [],
            delay = 0.1;
        this.props.teachers.filter(teacher => teacher.name.lastname.toUpperCase().includes(this.props.search.toUpperCase()))
            .sort((a, b) => a.name.lastname.localeCompare(b.name.lastname)).map(teacher => {
            teacherElements.push(<ContainerTeachersElement key={teacher.teacherId} delay={delay} teacher={teacher} />)
            if (delay < 1.6) delay *= 1.1;
        })

        return (
            <>
                {this.props.addPopup ? <ContainerTeachersAddPopup toggle={this.props.toggleAddPopup} /> : null}
                {
                    teacherElements.length > 0 ?
                        <div className="row px-2">
                            {teacherElements}
                        </div>
                        :
                        this.props.search ?
                            <ContainerInformationBanner
                                icon="person-outline"
                                color="var(--sys-gray)"
                                title={`Kein Lehrer mit "${this.props.search}" gefunden.`}
                                description="Ändere deine Eingabe, um den passenden Lehrer zu finden."
                            />
                            :
                            <ContainerInformationBanner
                                icon="person-outline"
                                color="var(--sys-gray)"
                                title="Keine Lehrer gefunden"
                                description="Drücke auf das Plus um ein Lehrer dem Kollegium hinzuzufügen"
                            />
                }
            </>
        );
    }
}

class ContentTeachers extends React.Component {
    constructor(props) {
        super(props);

        this.interval = setInterval(() => {if (DHUpdated) { this.setState({age: this.state.age++}); DHUpdated = false}}, 100)
        this.state = {
            color: "var(--sys-blue)",
            searchText: "",
            addPopup: false,
            age: 0
        }
    }
    componentWillUnmount() {clearInterval(this.interval)}

    toggleAddPopup = () => this.setState({addPopup: !this.state.addPopup})

    setSearchText = (val) => this.setState({searchText: val})

    render() {
        return (
            <ContentHolder>
                <CHHeading>
                    <ActionBar>
                        {hasPermission(Permission.TEACHER_ADD) ?
                            <ABButton key="1" icon="add-outline" trigger={this.toggleAddPopup} />
                            : null}
                        <ABSearchBar key="2" trigger={this.setSearchText} placeholder="Suchen" />
                    </ActionBar>

                    <Header title={`${this.state.searchText ? "Gefundene Lehrer" : "Alle Lehrer"} • ${getDH("teachers").length}`}
                            color={this.state.color} />
                </CHHeading>
                <CHBody>
                    <ContainerTeachers teachers={getDH("teachers")}
                                       search={this.state.searchText}
                                       addPopup={this.state.addPopup}
                                       toggleAddPopup={this.toggleAddPopup} />
                </CHBody>
            </ContentHolder>
        );
    }
}