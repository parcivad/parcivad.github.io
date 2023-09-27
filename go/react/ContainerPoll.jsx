class ContainerPollCreatePopup extends React.Component {
    constructor() {
        super();

        this.state = {
            title: "",
            description: "",
            anonymous: false,
            interactive: false,
            optionTitle: "",
            optionDescription: "",
            optionColor: "#007aff",
            pollOptions: []
        }
    }

    validate() {
        return !validateLength(this.state.title, 5, 40) && !validateLength(this.state.description, 5, 200)
            && this.state.pollOptions.length >= 1 && !getDH("polls").find(f => f.title === this.state.title)
    }

    addOption = () => {
        if (!validateLength(this.state.optionTitle, 4, 40) && !validateLength(this.state.optionDescription, 0, 140)
            && !this.state.pollOptions.find(f => f.title === this.state.optionTitle)) {
            this.setState({pollOptions: this.state.pollOptions.concat({
                    "title": this.state.optionTitle,
                    "description": this.state.optionDescription,
                    "hexColor": this.state.optionColor
                }), optionTitle: "", optionDescription: "", optionColor: "#007aff"})
        }
    }

    removeOption(optionTitle) {
        this.setState({pollOptions: this.state.pollOptions.filter(m => m.title !== optionTitle)})
    }

    create = async () => {
        if (this.validate()) {
            api("/student/poll/create", "POST", JSON.stringify({
                "title": this.state.title,
                "description": this.state.description,
                "anonymous": this.state.anonymous,
                "interactive": this.state.interactive,
                "pollOptions": this.state.pollOptions
            })).then(value => {
                modifyDataDH("polls", value.data)
                this.props.toggle()
            })
        }
    }

    render() {
        return (
            <Popup toggle={this.props.toggle}>
                <PPContent>
                    <PPHeadingIcon icon={"add-circle-outline"} color={"var(--sys-gray)"}/>
                    <PPHeading>Umfrage erstellen</PPHeading>
                    <PPDescription>Erstelle eine Umfrage mit deiner Konfiguration, damit Schüler abstimmen können.</PPDescription>
                    <PPInputText
                        placeholder="Titel"
                        onValid={v => validateLength(v, 5, 40)}
                        onInput={v => this.setState({title: v})}
                        onEnter={() => $("#pc2").focus()}
                    />
                    <PPInputText
                        id="pc2"
                        placeholder="Beschreibung"
                        onValid={v => validateLength(v, 5, 200)}
                        onInput={v => this.setState({description: v})}
                        onEnter={() => {}}
                    />

                    <div className="w-100 d-flex justify-content-center text-start mt-2">
                        <div className="row justify-content-between" style={{width: "85%"}}>
                            <div className="col d-flex align-items-center justify-content-between p-2 me-1"
                                 style={{backgroundColor: "var(--sys-gray6)", borderRadius: 6}}>
                                <div>
                                    <p className="m-0" style={{fontSize: "11pt", fontWeight: 550}}>Anonym</p>
                                    <p className="m-0" style={{color: "var(--sys-gray)", fontSize: "10pt", fontWeight: 550}}>
                                        Personen werden versteckt.
                                    </p>
                                </div>
                                <ItemSwitch
                                    trigger={() => this.setState({anonymous: !this.state.anonymous})}
                                    checked={this.state.anonymous}
                                />
                            </div>
                            <div className="col d-flex align-items-center justify-content-between p-2 ms-1"
                                 style={{backgroundColor: "var(--sys-gray6)", borderRadius: 6}}>
                                <div>
                                    <p className="m-0" style={{fontSize: "11pt", fontWeight: 550}}>Interaktiv</p>
                                    <p className="m-0" style={{color: "var(--sys-gray)", fontSize: "10pt", fontWeight: 550}}>
                                        Optionen ergänzen möglich.
                                    </p>
                                </div>
                                <ItemSwitch
                                    trigger={() => this.setState({interactive: !this.state.interactive})}
                                    checked={this.state.interactive}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-100 d-flex justify-content-center text-start mt-2">
                        <div style={{overflow: "hidden", borderRadius: 6, width: "85%"}}>
                            <div className="p-2" style={{backgroundColor: "var(--sys-gray6)"}}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <p className="m-0" style={{fontSize: "11pt", fontWeight: 550}}>Optionen hinzufügen</p>
                                    <Motion.motion.div
                                        onClick={this.addOption}
                                        whileHover={{color: "var(--sys-green)"}}
                                        style={{color: "var(--sys-gray)", cursor: "pointer"}}
                                    >
                                        <ion-icon name="add-circle" style={{color: "currentColor"}} />
                                    </Motion.motion.div>
                                </div>

                                <div className="d-flex flex-column align-items-center py-2" style={{border: "4px dashed var(--sys-gray4)"}}>
                                    <PPInputText
                                        placeholder="Titel"
                                        onValid={v => validateLength(v, 4, 40)}
                                        onInput={v => this.setState({optionTitle: v})}
                                        onEnter={() => $("#pcO2").focus()}
                                    />
                                    <PPInputText
                                        id="pcO2"
                                        placeholder="Beschreibung (optional)"
                                        onValid={v => validateLength(v, 5, 200)}
                                        onInput={v => this.setState({optionDescription: v})}
                                        onEnter={() => {}}
                                    />

                                    <div className="d-flex justify-content-center mt-2">
                                        <ItemColorSelection
                                            color={this.state.optionColor}
                                            trigger={(color) => this.setState({optionColor: color})}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-2" style={{backgroundColor: "var(--sys-gray5)"}}>
                                {
                                    this.state.pollOptions.map(pollOption => {
                                        return <div className="d-flex align-items-center justify-content-between mb-2" key={pollOption.title}>
                                            <div className="d-flex align-items-center">
                                                <div className="me-2" style={{width: "15px", height: "15px", borderRadius: "100%", backgroundColor: pollOption.hexColor}}/>
                                                <div>
                                                    <p className="m-0" style={{fontSize: "11pt", fontWeight: 550}}>
                                                        {pollOption.title}
                                                    </p>
                                                    <p className="m-0" style={{fontSize: "10pt", color: "var(--sys-gray)"}}>
                                                        {pollOption.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <Motion.motion.div
                                                className="icon-button"
                                                initial={{color: "var(--sys-gray2)"}}
                                                whileHover={{
                                                    color: "var(--sys-red)",
                                                    transition: { duration: 0.4 },
                                                }}
                                                onClick={() => this.removeOption(pollOption.title)}

                                            >
                                                <ion-icon style={{ color: "currentColor"}}
                                                          name={"remove-circle"}/>
                                            </Motion.motion.div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>

                </PPContent>

                <PPButton trigger={this.create}
                          disabled={!this.validate()}
                          color="#fff" bgColor="var(--sys-blue)">Hinzufügen</PPButton>
            </Popup>
        );
    }
}

class ContainerPollElement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            windowOpened: false,
            deletionPopup: false,
            addOptionPopup: false,
            detailsPopup: false,
            deletePollOptionId: "",

            title: "",
            description: "",
            hexColor: "#32ade6"
        }
    }

    componentDidMount() {
        this.initEChart();
    }

    componentDidUpdate() {
        this.initEChart()
    }

    addOption = async () => {
        api(`/student/poll/${this.props.poll.pollId}/option/add`, "POST", JSON.stringify({
            "title": this.state.title,
            "description": this.state.description,
            "hexColor": this.state.hexColor
        })).then(value => {
            this.setState({addOptionPopup: false})
            modifyDataDH("polls", getDH("polls").map(p => p.pollId === this.props.poll.pollId
                ? value.data : p))
        })
    }

    removeOption = async (pollOptionId) => {
        api(`/student/poll/${this.props.poll.pollId}/option/${pollOptionId}/remove`, "POST",null)
            .then(value => modifyDataDH("polls", getDH("polls").map(p => p.pollId === this.props.poll.pollId
                ? value.data : p)))
    }

    voteOption = async (pollOptionId) => {
        api(`/student/poll/${this.props.poll.pollId}/vote/${pollOptionId}`, "POST", null)
            .then(value => modifyDataDH("polls", getDH("polls").map(p => p.pollId === this.props.poll.pollId
                ? value.data : p)))
    }

    toggleLike = async () => {
        api(`/student/poll/${this.props.poll.pollId}/like`, "POST", null)
            .then(value => modifyDataDH("polls", getDH("polls").map(p => p.pollId === this.props.poll.pollId
                ? value.data : p)))
    }

    delete = async () => {
        api(`/student/poll/${this.props.poll.pollId}/delete`, "POST", null)
            .then(value => {
                this.setState({addOptionPopup: false})
                modifyDataDH("polls", value.data)
        })
    }

    /**
     * Init of ranking eChart with given options and elected students.
     * Call only after component build!
     */
    initEChart() {
        let backgroundColor = "#eaeaef";
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            backgroundColor = "#2c2c2e";
        }

        let option = {
            tooltip: {
                trigger: 'item'
            },
            backgroundColor: "transparent",
            series: [
                {
                    type: 'pie',
                    top: '-8%',
                    left: '-20%',
                    right: '-20%',
                    bottom: '-8%',
                    avoidLabelOverlap: false,
                    itemStyle: {
                        textStyle: {
                            fontSize: "20pt"
                        },
                        normal : {
                            label : {
                                textStyle: {
                                    fontSize: "15px",
                                    fontWeight: "bold"
                                },
                                show: true,
                                position: 'inner',
                                formatter : function (params){
                                    return  params.value
                                },
                            },
                            labelLine : {
                                show : false
                            },
                            borderRadius: 10,
                            borderColor: backgroundColor,
                            borderWidth: 4
                        },
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    data: this.props.poll.pollOptions.map(pollOption => {
                        if (pollOption.votes.length === 0) return null
                        return {
                            value: pollOption.votes.length,
                            name: pollOption.title,
                            itemStyle: {
                                color: pollOption.hexColor
                            }
                        }
                    })
                }
            ]
        };

        try {
            let myChart = echarts.init(document.getElementById(`chart${this.props.poll.title}`))
            myChart.setOption(option);

            window.addEventListener('resize', function() {
                myChart.resize();
            });

            window.matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change',() => this.initEChart());
        } catch (exception) {}
    }

    render() {
        let votes = 0,
            canDelete = hasPermission(Permission.POLL_DELETE) ||
                hasPermission(Permission.POLL_DELETE_OWN)
                && this.props.poll.published.studentId === getDH("identity").studentId,
            voted = this.props.poll.pollOptions
            .find(pO => pO.votes.find(pOv => pOv.studentId === getDH("identity").studentId)) !== undefined;
        this.props.poll.pollOptions.forEach(pollOption => votes += pollOption.votes.length)

        let gradient = "linear-gradient(90deg ";
        this.props.poll.pollOptions.forEach(pollOption => {
            gradient += `, ${pollOption.hexColor}`
        })
        gradient +=")"
        if (this.props.poll.pollOptions.length === 1) gradient = this.props.poll.pollOptions[0].hexColor

        return (
            <>
                {this.state.deletionPopup ?
                    <Popup toggle={() => this.setState({deletionPopup: false})}>
                        <PPContent>
                            <PPHeadingIcon icon={"trash-outline"} color={"var(--sys-red)"} />
                            <PPHeading>Umfrage Löschen</PPHeading>
                            <PPDescription>
                                Möchtest du wirklich die <strong>Umfrage "{this.props.poll.title}"</strong> endgültig
                                löschen? Alternativ kannst du diese Umfrage auch beenden, so wird sie nur archiviert.
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
                    : null
                }
                {this.state.deletePollOptionId ?
                    <Popup toggle={() => this.setState({deletePollOptionId: false})}>
                        <PPContent>
                            <PPHeadingIcon icon={"trash-outline"} color={"var(--sys-red)"} />
                            <PPHeading>Umfrage Option Löschen</PPHeading>
                            <PPDescription>
                                Möchtest du wirklich die <strong>Umfrage Option "{this.props.poll.pollOptions.find(pO => pO.pollOptionId === this.state.deletePollOptionId).title}"</strong> endgültig
                                löschen? Alle Stimmen für diese Umfrage Option gehen verloren!
                            </PPDescription>
                        </PPContent>

                        <PPButton
                            trigger={() => this.setState({deletePollOptionId: ""})}
                            color={"var(--sys-black)"}
                            bgColor={"var(--sys-gray6)"}
                        >
                            Abbruch
                        </PPButton>
                        <PPButton
                            trigger={() => {
                                this.removeOption(this.state.deletePollOptionId)
                                this.setState({deletePollOptionId: ""})
                            }}
                            color={"#fff"}
                            bgColor={"var(--sys-red)"}
                        >
                            Löschen
                        </PPButton>
                    </Popup>
                    : null
                }
                {this.state.addOptionPopup ?
                    <Popup toggle={() => this.setState({addOptionPopup: false})}>
                        <PPContent>
                            <PPHeadingIcon icon={"pie-chart-outline"} color={this.state.hexColor} />
                            <PPHeading>{this.props.poll.title}</PPHeading>
                            <PPDescription>Füge eine Umfrage Option mit optionaler Beschreibung hinzu.</PPDescription>
                            <PPInputText
                                placeholder="Titel"
                                onValid={v => validateLength(v, 4, 40)}
                                onInput={v => this.setState({title: v})}
                                onEnter={() => $("#pcEO2").focus()}
                            />
                            <PPInputText
                                id="pcEO2"
                                placeholder="Beschreibung (optional)"
                                onValid={v => validateLength(v, 0, 140)}
                                onInput={v => this.setState({description: v})}
                                onEnter={() => {}}
                            />

                            <div className="col-12 mt-3 d-flex justify-content-center">
                                <ItemColorSelection color={this.state.hexColor}
                                                    trigger={(val) => this.setState({hexColor: val})}/>
                            </div>
                        </PPContent>

                        <PPButton
                            trigger={() => this.setState({addOptionPopup: false})}
                            color={"var(--sys-black)"}
                            bgColor={"var(--sys-gray6)"}
                        >
                            Abbruch
                        </PPButton>
                        <PPButton
                            trigger={this.addOption}
                            color={"#fff"}
                            disabled={validateLength(this.state.title, 4, 40)
                                || validateLength(this.state.description, 0, 140)}
                            bgColor={"var(--sys-blue)"}
                        >
                            Hinzufügen
                        </PPButton>
                    </Popup>
                    : null
                }
                {this.state.detailsPopup ?
                    <Popup toggle={() => this.setState({detailsPopup: false})}>
                        <PPContent>
                            <div className="roundContainerInner p-1 mb-3 mt-2 mt-sm-0">
                                <h5 className="m-0 fw-bold">{this.props.poll.title}</h5>
                            </div>
                            {this.props.poll.pollOptions.map(pollOption => {
                                let count = pollOption.votes.length;

                                return <div className="roundContainerInner p-2 mb-2">
                                    <div className="d-flex align-items-start justify-content-between">
                                        <p className="m-0" style={{fontSize: "13pt", fontWeight: "550"}}>
                                            {pollOption.title}
                                        </p>
                                        <p className="m-0 fw-bold">{count} {count === 1 ? "Stimme" : "Stimmen"}</p>
                                    </div>
                                    {pollOption.votes.length !== 0 ?
                                        <>
                                            <div className="spacer" />
                                            <div>
                                                {pollOption.votes.map(vote => {
                                                    let name = getDH("students").find(s => s.studentId === vote.studentId).name,
                                                        date = timeToString(new Date(vote.date));
                                                    return <>
                                                        <div className="d-flex align-items-center justify-content-between py-1">
                                                            <div className="d-flex align-items-center">
                                                                <ItemAvatar size="32px"/>
                                                                <p className="m-0 ps-2">{name.firstname} {name.lastname}</p>
                                                            </div>
                                                            <p className="m-0" style={{fontSize: "10pt", color: "var(--sys-gray)"}}>{date}</p>
                                                        </div>
                                                    </>
                                                })}
                                            </div>
                                        </>
                                        :
                                        null
                                    }
                                </div>
                            })}
                        </PPContent>
                    </Popup>
                    : null
                }
                <Motion.motion.div
                    className="roundContainer pb-5 pb-sm-3"
                    variants={{
                        hidden: {opacity: 0},
                        show: {opacity: 1},
                        exit: {opacity: 0}
                    }}
                >
                    <div className="roundContainerInner w-100">
                        <div className="mb-3" style={{borderRadius: "20px", height: "10px", width: "100%", background: gradient}} />
                        <div className="d-flex align-items-start justify-content-between">
                            <div className="d-flex align-items-center">
                                <div>
                                    <h5 className="mb-1">{this.props.poll.title} <span style={{color: "var(--sys-gray)"}}>• {votes}<span style={{fontSize: "13pt"}}>/{getDH("students").length}</span></span></h5>
                                    <p style={{fontSize: "11pt", color: "var(--sys-gray)"}}>
                                        {this.props.poll.description}
                                    </p>
                                </div>
                            </div>
                            <Motion.motion.div animate={{rotate: this.state.windowOpened ? 180 : 0}}
                                               className="ms-2 d-flex align-items-center cursor-pointer"
                                               onClick={() => this.setState({windowOpened: !this.state.windowOpened})}>
                                <ion-icon name="caret-down-outline" style={{fontSize: "20pt", color: "var(--sys-black)"}} />
                            </Motion.motion.div>
                        </div>
                        <Motion.AnimatePresence>
                            {this.state.windowOpened && (
                                <Motion.motion.div
                                    initial={{height: 0, opacity: 0}}
                                    animate={{height: "auto", opacity: 1}}
                                    exit={{height: 0, opacity: 0}}
                                    className="col-12 row justify-content-between m-0">
                                    <div className="col-12 col-md-5">
                                        <div className="roundContainer h-100 w-100">
                                            <div className="roundContainerInner h-100 w-100"
                                                 style={{backgroundColor: "var(--sys-gray5)"}}
                                            >
                                                <div id={`chart${this.props.poll.title}`}
                                                     style={{width: "100%", height: "100%",
                                                         minHeight: "230px", minWidth: "230px"}}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-7">
                                        <div className="roundContainer pe-0">
                                            <div className="overflow-scroll pollOptions">
                                                <div className="mb-4 ps-1">
                                                    {this.props.poll.pollOptions.sort((a, b) => b.votes.length - a.votes.length).map(pollOption => {
                                                        let voted = pollOption.votes.find(v => v.studentId === getDH("identity").studentId) !== undefined;

                                                        let bulb = <div className="me-2 fw-bold d-flex justify-content-center align-items-center"
                                                                        style={{width: "20px", height: "20px", borderRadius: "100%", backgroundColor: pollOption.hexColor, fontSize: "9pt", color: "#fff"}}>
                                                            {pollOption.votes.length}
                                                        </div>
                                                        if (pollOption.votes.length === 0)
                                                            bulb = <div className="me-2" style={{width: "15px", height: "15px", borderRadius: "100%", backgroundColor: pollOption.hexColor}}/>

                                                        return <div key={pollOption.pollOptionId}
                                                                    className="d-flex align-items-center justify-content-between px-2 py-1 mb-2 w-100"
                                                                    style={{borderRadius: voted ? "6px" : "4px", border: voted ? "2px solid var(--sys-blue)" : "1px solid var(--sys-gray4)"}}>
                                                            <div className="d-flex align-items-center cursor-pointer" onClick={() => this.voteOption(pollOption.pollOptionId)}>
                                                                {bulb}
                                                                <div>
                                                                    <p className="m-0 fw-bold">{pollOption.title}</p>
                                                                    <p className="m-0" style={{fontSize: "10pt", color: "var(--sys-gray0)"}}>{pollOption.description}</p>
                                                                </div>
                                                            </div>
                                                            {
                                                                this.props.poll.pollOptions.length > 1 && hasPermission(Permission.POLL_OPTION_REMOVE) && (
                                                                    <Motion.motion.div
                                                                        className="icon-button"
                                                                        initial={{color: "var(--sys-gray2)"}}
                                                                        whileHover={{
                                                                            color: "var(--sys-red)",
                                                                            transition: { duration: 0.4 },
                                                                        }}
                                                                        onClick={() => this.setState({deletePollOptionId: pollOption.pollOptionId})}

                                                                    >
                                                                        <ion-icon style={{ color: "currentColor"}}
                                                                                  name={"remove-circle"}/>
                                                                    </Motion.motion.div>
                                                                )
                                                            }
                                                        </div>
                                                    })}
                                                    {
                                                        this.props.poll.interactive && hasPermission(Permission.POLL_OPTION_ADD) && (
                                                            <div className="w-100">
                                                                <Motion.motion.div
                                                                    onClick={() => this.setState({addOptionPopup: !this.state.addOptionPopup})}
                                                                    whileHover={{
                                                                        backgroundColor: "var(--sys-gray6)",
                                                                        color: "var(--sys-gray)"
                                                                    }}
                                                                    className="mb-2 py-1 px-2 cursor-pointer d-flex justify-content-center"
                                                                    style={{
                                                                        backgroundColor: "var(--sys-gray5)",
                                                                        color: "var(--sys-gray)",
                                                                        border: "1px solid var(--sys-gray)",
                                                                        borderRadius: "8px"
                                                                    }}>

                                                                    <ion-icon name="add"/>
                                                                </Motion.motion.div>
                                                            </div>
                                                        )
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Motion.motion.div>
                            )}
                        </Motion.AnimatePresence>
                        <div className="d-flex justify-content-between pt-2">
                            <div>
                                {new Date().getTime() - new Date(this.props.poll.published.date).getTime() < 72000000 &&
                                    (<p className="badge me-1">NEU</p>)
                                }
                                {this.props.poll.closed && (<p className="badge me-1">🚫 Beendet</p>)}
                                {this.props.poll.interactive && (<p className="badge me-1">👋 Interaktiv</p>)}
                                {this.props.poll.anonymous && (<p className="badge">🥷 Anonym</p>)}
                            </div>
                            <div className="d-flex align-content-center">
                                {!this.props.poll.anonymous && (
                                    <Motion.motion.div
                                        className="icon-button pe-2 mb-1"
                                        initial={{color: "var(--sys-gray)"}}
                                        whileHover={{
                                            color: "var(--sys-black)",
                                            transition: { duration: 0.2 },
                                        }}
                                        onClick={() => this.setState({detailsPopup: !this.state.detailsPopup})}
                                    >
                                        <ion-icon className="text-end" name={"people"} style={{color: "currentColor"}} />
                                    </Motion.motion.div>
                                )}
                                <ItemLikeButton
                                    horizontal={true}
                                    trigger={this.toggleLike}
                                    count={this.props.poll.likes.length}
                                    liked={this.props.poll.likes.find(l => l.studentId === getDH("identity").studentId) !== undefined}
                                />
                                {canDelete && (
                                    <Motion.motion.div
                                        className="icon-button ps-1 mb-2"
                                        initial={{color: "var(--sys-gray)"}}
                                        whileHover={{
                                            color: "var(--sys-red)",
                                            transition: { duration: 0.4 },
                                        }}
                                        onClick={() => this.setState({deletionPopup: true})}
                                    >
                                        <ion-icon className="text-end"
                                                  name={"trash-outline"} style={{color: "currentColor"}} />
                                    </Motion.motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </Motion.motion.div>
            </>
        );
    }
}

class ContainerPoll extends React.Component {
    render() {
        return (
            <>
                {this.props.addPollPopup && (<ContainerPollCreatePopup toggle={this.props.toggleAddPollPopup}/>)}
                {this.props.polls.length !== 0 ?
                    <Motion.AnimatePresence>
                        <Motion.motion.div
                            variants={{
                                hidden: {},
                                show: {transition: {staggerChildren: 0.2}},
                                exit: {transition: {staggerChildren: 0.2}}
                            }}
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            key={this.props.key}
                        >
                            {this.props.polls.map(poll => <ContainerPollElement key={poll.pollId} poll={poll} />)}
                        </Motion.motion.div>
                    </Motion.AnimatePresence>
                    :
                    this.props.onlyLike ?
                        this.props.searchText ?
                            <ContainerInformationBanner
                                title={`Keine Umfragen mit "${this.props.searchText}" gefunden, die dir gefallen.`}
                                description="Ändere deine Sucheingabe oder suche nach allen Umfragen."
                                icon="search-outline"
                                color="gray"
                            />
                            :
                            <ContainerInformationBanner
                                title="Keine Umfragen gefunden, die dir gefallen."
                                description="Drücke auf das Herz einer Umfrage, um sie als gefällt mir zu makieren."
                                icon="heart-outline"
                                color="gray"
                            />
                        :
                        this.props.searchText ?
                            <ContainerInformationBanner
                                title={`Keine Umfragen mit "${this.props.searchText}" gefunden`}
                                description="Ändere deine Sucheingabe, um die passende Umfrage zu finden."
                                icon="search-outline"
                                color="gray"
                            />
                            :
                            <ContainerInformationBanner
                                title="Keine Umfragen gefunden"
                                description="Drücke auf das Plus, um eine neue Umfrage hinzuzufügen."
                                icon="pie-chart-outline"
                                color="gray"
                            />
                }
            </>
        );
    }
}

class ContentPoll extends React.Component {
    constructor(props) {
        super(props);

        this.interval = setInterval(() => {if (DHUpdated) { this.setState({age: this.state.age++}); DHUpdated = false}}, 100)
        this.state = {
            color: "var(--sys-cyan)",
            addPollPopup: false,
            searchText: "",
            sorting: "date-descending",
            onlyLike: false,
            age: 0
        }
    }
    componentWillUnmount() {clearInterval(this.interval)}

    toggleAddPollPopup = () => this.setState({addPollPopup: !this.state.addPollPopup})

    updateOnlyLikes = () => this.setState({onlyLike: !this.state.onlyLike})

    updateSorting = (val) => this.setState({sorting: val})

    setSearchText = (val) => this.setState({searchText: val})

    render() {
        // filters for only likes or search Text and sorts with given parameter
        let polls = getDH("polls")
            .filter(poll => {
                if (this.state.onlyLike)
                    return poll.likes.find(l => l.studentId === getDH("identity").studentId) !== undefined
                return true
            })
            .filter(poll => poll.title.toLowerCase().includes(this.state.searchText.toLowerCase())
                || poll.description.toLowerCase().includes(this.state.searchText.toLowerCase())
            )
            .sort((a, b) => {
                let aVal, bVal;
                switch (this.state.sorting) {
                    case "date-ascending":
                        aVal = new Date(b.published.date).getTime()
                        bVal = new Date(a.published.date).getTime()
                        break;
                    case "date-descending":
                        aVal = new Date(a.published.date).getTime()
                        bVal = new Date(b.published.date).getTime()
                        break;
                    case "like-ascending":
                        aVal = b.likes.length
                        bVal = a.likes.length
                        break;
                    case "like-descending":
                        aVal = a.likes.length
                        bVal = b.likes.length
                        break;
                    case "vote-ascending":
                        aVal = 0; bVal = 0
                        a.pollOptions.forEach(pollOption => bVal += pollOption.votes.length)
                        b.pollOptions.forEach(pollOption => aVal += pollOption.votes.length)
                        break
                    case "vote-descending":
                        aVal = 0; bVal = 0
                        a.pollOptions.forEach(pollOption => aVal += pollOption.votes.length)
                        b.pollOptions.forEach(pollOption => bVal += pollOption.votes.length)
                        break

                    default:
                        return 0;
                }

                return aVal > bVal ? -1 : (aVal < bVal ? 1 : 0);

            })

        return (
            <ContentHolder>
                <CHHeading>
                    <ActionBar>
                        <ABButton key="1" trigger={this.toggleAddPollPopup} icon="add-outline" />
                        <ABButton key="2"
                                  trigger={this.updateOnlyLikes}
                                  icon={this.state.onlyLike ? "heart" : "heart-outline"} />
                        <ABSearchBar key="3" trigger={this.setSearchText} placeholder="Suchen" />
                    </ActionBar>

                    <Header title={`${this.state.searchText ? "Gefundene Umfragen" : "Umfragen"} • ${getDH("polls").length}`}
                            color={this.state.color} >
                        <HSorting trigger={this.updateSorting}
                                  default={this.state.sorting}
                                  options={{
                                      "date-ascending": '▲ Hinzugefügt',
                                      "date-descending": '▼ Hinzugefügt',
                                      "like-ascending": '▲ Likes',
                                      "like-descending": '▼ Likes',
                                      "vote-ascending": '▲ Stimmen',
                                      "vote-descending": '▼ Stimmen'
                                  }}
                        />
                    </Header>
                </CHHeading>
                <CHBody>
                    <ContainerPoll polls={polls}
                                   onlyLike={this.state.onlyLike}
                                   searchText={this.state.searchText}
                                   addPollPopup={this.state.addPollPopup}
                                   toggleAddPollPopup={this.toggleAddPollPopup} />
                </CHBody>
            </ContentHolder>
        );
    }
}