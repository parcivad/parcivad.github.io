class ContainerRankingElement extends React.Component {
    constructor(props) {
        super(props);

        let voted = props.ranking.votes.find(vote => vote["voterId"] === getDH("identity")["studentId"]) !== undefined;
        this.state = {
            electedId: voted ? props.ranking.votes.find(vote => vote["voterId"] === getDH("identity")["studentId"])["electedId"] : "",
            pieChart: props.pieChart,
            deletionPopup: false
        };
    }

    componentDidMount() { this.initEChart() }
    componentDidUpdate() { this.initEChart() }
    componentWillReceiveProps(nextProps) {
        if (this.state.pieChart !== nextProps.pieChart) {
            this.setState({pieChart: nextProps.pieChart})
        }
    }

    like = async () => {
        return await api(`/student/ranking/${this.props.ranking.rankingId}/like`, "POST", null)
            .then(value => modifyDataDH("rankings", getDH("rankings")
                .map(ranking => ranking.rankingId === this.props.ranking.rankingId ? value.data : ranking)))
            .catch(error => {
                return error;
            })
    }

    vote = async () => {
        if (this.state.electedId === "") return

        return await api(`/student/ranking/${this.props.ranking.rankingId}/vote/${this.state.electedId}`,
            "POST", null)
            .then(value => modifyDataDH("rankings",
                getDH("rankings").map(ranking => ranking.rankingId === this.props.ranking.rankingId ? value.data : ranking)))
            .catch(error => error)
    }

    exclude = async () => {
        return await api(`/student/ranking/${this.props.ranking.rankingId}/exclude`, "POST", null)
            .then(value => modifyDataDH("rankings",
                getDH("rankings").map(ranking => ranking.rankingId === this.props.ranking.rankingId ? value.data : ranking)))
            .catch(error => error)
    }

    delete = async () => {
        return await api(`/student/ranking/${this.props.ranking.rankingId}/delete`, "POST", null)
            .then(value => modifyDataDH("rankings", value.data))
            .catch(error => error)
    }

    selectionElementList() {
        return getDH("students")
            .sort((a, b) => a.name.lastname.localeCompare(b.name.lastname))
            .map(student => {
                return <option key={student.studentId} value={student.studentId}>
                    {student.name.firstname} {student.name.lastname}
                </option>
            })
            .concat(<option key={"lehrer"} disabled={true} value={"lehrer"}>Lehrer wählen</option>)
            .concat(getDH("teachers")
                .sort((a, b) => a.name.lastname.localeCompare(b.name.lastname))
                .map(teacher => {
                    return <option key={teacher.teacherId} value={teacher.teacherId}>
                        {teacher.name.firstname} {teacher.name.lastname}
                    </option>
                }))
    }

    deleteElement() {
        if (!hasPermission(Permission.RANKING_DELETE)
            && !hasPermission(Permission.RANKING_DELETE_OWN)) return <></>;

        if (!hasPermission(Permission.RANKING_DELETE) && hasPermission(Permission.RANKING_DELETE_OWN)
            && this.props.ranking.rankingPublish.studentId !== getDH("identity").studentId) return <></>;

        return <Motion.motion.div
            className="icon-button"
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
    }

    /**
     * Called in render to provide JSX Elements of ranking
     * @returns {JSX.Element}
     */
    rankingBody() {
        let electedStudents = this.getElectedStudents();

        if (electedStudents.length === 0)
            return <ContainerInformationBanner
                title={``}
                description={"Es gibt noch keine Votes."}
                icon={"telescope-outline"}
                color={"gray"}
            />

        return this.state.pieChart ?
            <div className="w-100 h-100 pb-1">
                <div id={'chart'+this.props.ranking.rankingId} className="w-100 h-100" />
            </div>
            :
            <div className="p-3">
                {electedStudents.map((electedStudent) => {
                    // find go via directory
                    let person = getPerson(electedStudent[0]),
                        votes = electedStudent[1];

                    return <div key={electedStudent[0]} className="ranking-element pb-2 d-flex align-items-center justify-content-between pb-2">
                        <div className="d-flex">
                            <ItemAvatar size="40px"/>
                            <div className="ps-2 pt-1">
                                <h6 className="m-0">{person.name.firstname} {person.name.lastname}</h6>
                                <p className="m-0" style={{fontSize: "10pt", color: "var(--sys-gray)"}}>
                                    <span className="fw-bold">{votes}</span> {votes === 1 ? "Stimme" : "Stimmen"}
                                </p>
                            </div>
                        </div>
                        <p>{Math.floor((votes / this.props.ranking.votes.length) * 10000) / 100} %</p>
                    </div>
                })}
            </div>
    }

    /**
     * Sorts the votes contained in the state after elections
     * @returns {*[]}   Sorted Election list
     */
    getElectedStudents() {
        // count elections of students in the vote list
        let votedStudents = {};
        this.props.ranking.votes.forEach(vote => {
            let studentId = vote.electedId

            // watch for students on the exclamation list
            if (!this.props.ranking.exclamations.includes(studentId)) {
                // otherwise count votes
                if (!votedStudents[studentId]) votedStudents[studentId] = 0
                votedStudents[studentId]++
            }
        })

        // sort elected students after elections
        let electedStudents = []
        for (let key in votedStudents) electedStudents.push([key, votedStudents[key]])
        electedStudents.sort(function(a, b) { return a[1] > b[1] ? -1 : (a[1] < b[1] ? 1 : 0) })
        return electedStudents
    }

    /**
     * Init of ranking eChart with given options and elected students.
     * Call only after component build!
     */
    initEChart() {
        if (this.state.pieChart) {
            let backgroundColor = "#eaeaef",
                textColor = "#000";

            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                backgroundColor = "#2c2c2e";
                textColor = "#fff";
            }

            let option = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    bottom: '5%',
                    left: 'center',
                    textStyle: {
                        color: textColor
                    }
                },
                backgroundColor: backgroundColor,
                series: [
                    {
                        type: 'pie',
                        top: '-8%',
                        left: '-20%',
                        right: '-20%',
                        bottom: '14%',
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: backgroundColor,
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        data: this.getElectedStudents().map(electedStudent => {
                            // find go via directory
                            let person = getPerson(electedStudent[0]),
                                votes = electedStudent[1];

                            let name = `${person.name.firstname} ${person.name.lastname.split('', 1)}.`
                            if (isset(person.teacherId)) name = `${person.name.firstname} ${person.name.lastname}`

                            return {
                                value: votes,
                                name: name
                            }
                        }).slice(0, 5)
                    }
                ]
            };

            try {
                let myChart = echarts.init(document.getElementById('chart'+this.props.ranking.rankingId))
                myChart.setOption(option);

                window.addEventListener('resize', function() {
                    myChart.resize();
                });

                window.matchMedia('(prefers-color-scheme: dark)')
                    .addEventListener('change',() => this.initEChart());
            } catch (exception) {}
        }
    }

    render() {
        let liked = this.props.ranking.likes.find(like => like["studentId"] === getDH("identity").studentId) !== undefined,
            excluded = this.props.ranking.exclamations.find(exclude => exclude === getDH("identity").studentId) !== undefined,
            date = timeToString(new Date(this.props.ranking.rankingPublish.date)),
            publishedByName = "anonym",
            voted = this.props.ranking.votes.find(vote => vote.voterId === getDH("identity").studentId) !== undefined
                && this.props.ranking.votes.find(vote => vote.voterId === getDH("identity").studentId).electedId === this.state.electedId;

        if (hasPermission(Permission.RANKING_SHOW_PUBLISHER)) {
            let publishedBy = getDH("students").find(s => s.studentId === this.props.ranking.rankingPublish.studentId);
            publishedByName = `${publishedBy.name.firstname} ${publishedBy.name.lastname}`
        }


        return (
            <>
                {this.state.deletionPopup ?
                    <Popup toggle={() => this.setState({deletionPopup: false})}>
                        <PPContent>
                            <PPHeadingIcon icon={"trash-outline"} color={"var(--sys-red)"} />
                            <PPHeading>Ranking Löschen</PPHeading>
                            <PPDescription>
                                Möchtest du das Ranking wirklich endgültig löschen?
                            </PPDescription>
                            <div className={"pt-2"}>
                                <PPDescription>
                                    Titel: <mark>{this.props.ranking.title}</mark>
                                </PPDescription>
                            </div>
                            <div className={"pt-2"}>
                                <PPDescription>
                                    Interaktionen: <mark>{this.props.ranking.votes.length + this.props.ranking.exclamations.length + this.props.ranking.likes.length}</mark>
                                </PPDescription>
                            </div>
                            <div className={"pt-2"}>
                                <PPDescription>
                                    Veröffentlicht von: <mark>{publishedByName}</mark> ({date})
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
                <Motion.motion.div
                    style={{minHeight: "480px", maxHeight: "480px"}}
                    className="ranking col-12 col-md-6 col-xl-4 h-100 pb-3"
                    initial={{ y: 20, scale: 0.9, opacity: 0 }}
                    animate={{ y: 0, scale: 1, opacity: 1 }}
                    transition={{
                        delay: this.props.delay,
                        duration: 0.6
                    }}
                >
                    <div style={{height: "480px"}}>
                        <div className="ranking-header p-3 w-100" style={{minHeight: "120px", maxHeight: "115px"}}>
                            <div className="d-flex justify-content-between" style={{maxHeight: "50px", overflowY: "auto"}}>
                                <h5 style={{fontSize: "14pt"}}>{this.props.ranking.title}</h5>
                                <div className="ps-1">
                                    <ItemLikeButton
                                        trigger={this.like}
                                        liked={liked}
                                        count={this.props.ranking.likes.length}
                                    />
                                </div>
                            </div>

                            <div className="d-flex align-items-center justify-content-between pt-2" style={{maxHeight: "40px"}}>
                                <div className="d-flex">
                                    <div className="icon-button text-start">
                                        <ion-icon style={{color: "var(--sys-black)"}}
                                                  name="arrow-forward-outline" />
                                    </div>
                                    <select className="ranking-vote-select" value={this.state.electedId}
                                            onChange={event => this.setState({electedId: event.target.value})}>
                                        <option key={"person"} disabled={true} value={""}>Person wählen</option>
                                        {this.selectionElementList()}
                                    </select>
                                </div>
                                <div className={`d-flex text-end ${voted ? "" : "actionTextHighlight"}`}>
                                    <ItemTextButton
                                        trigger={this.vote}
                                        text={voted ? "Entfernen" : "Vote"}
                                        weight="bold"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="ranking-body h-100">
                            {this.rankingBody()}
                        </div>
                        <div className="ranking-footer px-3 pb-1 d-flex justify-content-evenly">
                            <button className="w-50 p-0 btn text-start"
                                    style={{fontSize: "11pt", color: "currentColor"}}>
                                    <span className="fw-bold">
                                        {this.props.ranking.exclamations.length}
                                    </span>
                                {this.props.ranking.exclamations.length === 1 ? " Pers. versteckt" : " Pers. versteckt"}
                            </button>
                            <div className="w-50 d-flex justify-content-end">
                                <div className="icon-button" onClick={this.exclude}>
                                    <ion-icon className="text-end" style={{color: "currentColor"}}
                                              name={excluded ? "eye-off-outline" : "eye-outline"}/>
                                </div>
                                <div className="icon-button"
                                     onClick={() => this.setState({pieChart: !this.state.pieChart})}>
                                    <ion-icon className="text-end" style={{color: "currentColor"}}
                                              name={this.state.pieChart ? "list-outline" : "pie-chart-outline"}/>
                                </div>
                                {this.deleteElement()}
                            </div>
                        </div>
                    </div>
                </Motion.motion.div>
            </>
        );
    }
}

class ContainerAddRanking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {title: ""}
    }

    addRanking = async () => {
        api(`/student/ranking/create/${this.state.title}`, "POST", null)
            .then(value => {
                modifyDataDH("rankings", value.data)
                this.props.toggle()
            })
            .catch(error => { return error })
    }

    render() {
        return (
            <Popup toggle={() => this.props.toggle()}>
                <PPContent>
                    <PPHeadingIcon icon={"add-circle-outline"} color={"var(--sys-gray)"}/>
                    <PPHeading>Ranking erstellen</PPHeading>
                    <PPDescription>Erstelle dein eigenes Ranking und lasse andere Schüler auf deine Frage abstimmen.</PPDescription>
                    <PPInputText
                        placeholder="Wer ...?"
                        onValid={v => validateLength(v, 5, 150)}
                        onInput={v => this.setState({title: v})}
                        onEnter={() => this.addRanking()}
                    />
                </PPContent>

                <PPButton trigger={this.addRanking} disabled={validateLength(this.state.title, 5, 150)}
                          color="#fff" bgColor="var(--sys-blue)">Hinzufügen</PPButton>
            </Popup>
        );
    }
}

class ContainerRanking extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: false
        }
    }


    render() {
        if (this.state.error) return <ContainerLoader height="100%" message="Etwas ist schiefgelaufen!" />

        let rankingElements = [];
        let id = 0;
        this.props.rankings.forEach(
            ranking => {
                rankingElements.push(
                    <ContainerRankingElement
                        pieChart={this.props.pieChart}
                        key={ranking.rankingId}
                        ranking={ranking}
                        delay={id++ * 0.1}
                    />)
            })

        if (rankingElements.length === 0 && this.props.onlyLike && this.props.search)
            return <>
                {this.props.addRanking ?
                    <ContainerAddRanking toggle={this.props.toggleAddRanking}/>
                    : null}
                <ContainerInformationBanner
                    title={`Kein Ranking mit "${this.props.search}" gefunden, das dir gefällt`}
                    description={"Drücke auf das Herz, um nach Ranking zu suchen die dir nicht gefallen."}
                    icon={"heart-dislike-outline"}
                    color={"gray"}
                />
            </>

        if (rankingElements.length === 0 && this.props.search)
            return <>
                {this.props.addRanking ?
                    <ContainerAddRanking toggle={this.props.toggleAddRanking}/>
                    : null}
                <ContainerInformationBanner
                    title={`Kein Ranking mit "${this.props.search}" gefunden`}
                    description={"Ändere deine Eingabe, um ein passendes Ranking zu finden."}
                    icon={"trending-up-outline"}
                    color={"gray"}
                />
            </>

        if (rankingElements.length === 0)
            return <>
                {this.props.addRanking ?
                    <ContainerAddRanking toggle={this.props.toggleAddRanking}/>
                    : null}
                <ContainerInformationBanner
                    title={`Keine Rankings gefunden`}
                    description={"Drücke auf das Plus, um ein neues Ranking hinzuzufügen."}
                    icon={"trending-up-outline"}
                    color={"gray"}
                />
            </>

        return (
            <>
                {this.props.addRanking ?
                    <ContainerAddRanking toggle={this.props.toggleAddRanking}/>
                    : null}
                <div className="row row-cols-auto justify-content-sm-between">
                    {rankingElements}
                </div>
            </>
        );
    }
}

class ContentRanking extends React.Component {
    constructor(props) {
        super(props);

        this.interval = setInterval(() => {if (DHUpdated) { this.setState({age: this.state.age++}); DHUpdated = false}}, 100)
        this.state = {
            color: "var(--sys-orange)",
            addRanking: false,
            searchText: "",
            sorting: "votes-descending",
            onlyLike: false,
            pieChart: true,
            age: 0
        }
    }
    componentWillUnmount() {clearInterval(this.interval)}

    toggleAddRanking = () => this.setState({addRanking: !this.state.addRanking})

    updateOnlyLikes = () => this.setState({onlyLike: !this.state.onlyLike})

    updateSorting = (val) => this.setState({sorting: val})

    setSearchText = (val) => this.setState({title: val ? "Gefundene Rankings" : "Rankings", searchText: val})

    setPieChart = () => this.setState({pieChart: true})

    setListView = () => this.setState({pieChart: false})

    render() {
        let rankings = getDH("rankings")
            .filter(ranking => {
                if (this.state.onlyLike) {
                    return ranking.likes.find(like => like.studentId === getDH("identity").studentId) !== undefined
                }
                return true;})
            .filter(ranking => ranking.title.toUpperCase().includes(this.state.searchText.toUpperCase()))
            .sort((a, b) => {
                let aVal, bVal;
                switch (this.state.sorting) {
                    case "date-ascending":
                        aVal = new Date(b.rankingPublish.date).getTime()
                        bVal = new Date(a.rankingPublish.date).getTime()
                        break;

                    case "date-descending":
                        aVal = new Date(a.rankingPublish.date).getTime()
                        bVal = new Date(b.rankingPublish.date).getTime()
                        break;

                    case "like-ascending":
                        aVal = b.likes.length
                        bVal = a.likes.length
                        break;

                    case "like-descending":
                        aVal = a.likes.length
                        bVal = b.likes.length
                        break;

                    case "votes-ascending":
                        aVal = b.votes.length
                        bVal = a.votes.length
                        break;

                    case "votes-descending":
                        aVal = a.votes.length
                        bVal = b.votes.length
                        break;

                    default:
                        return 0;
                }

                return aVal > bVal ? -1 : (aVal < bVal ? 1 : 0);

            })

        return (
            <ContentHolder>
                <CHHeading>
                    <ActionBar>
                        {hasPermission(Permission.RANKING_CREATE) ?
                            <ABButton key="1" trigger={this.toggleAddRanking} icon="add-outline" />
                            : null }
                        <ABButton key="2"
                                  trigger={this.updateOnlyLikes}
                                  icon={this.state.onlyLike ? "heart" : "heart-outline"} />
                        <ABGroup>
                            <ABButton key="1" trigger={this.setListView} icon="list-outline" />
                            <ABButton key="2" trigger={this.setPieChart} icon="pie-chart-outline" />
                        </ABGroup>
                        <ABSearchBar key="3" trigger={this.setSearchText} placeholder="Suchen" />
                    </ActionBar>

                    <Header title={`${this.state.searchText ? "Gefundene Rankings" : "Rankings"} • ${getDH("rankings").length}`}
                            color={this.state.color} >
                        <HSorting trigger={this.updateSorting}
                                  default={this.state.sorting}
                                  options={{
                                      "date-ascending": '▲ Hinzugefügt',
                                      "date-descending": '▼ Hinzugefügt',
                                      "like-ascending": '▲ Likes',
                                      "like-descending": '▼ Likes',
                                      "votes-ascending": '▲ Votes',
                                      "votes-descending": '▼ Votes'
                                  }}
                        />
                    </Header>
                </CHHeading>
                <CHBody>
                    <ContainerRanking
                        rankings={rankings}
                        addRanking={this.state.addRanking}
                        toggleAddRanking={this.toggleAddRanking}
                        pieChart={this.state.pieChart}
                        search={this.state.searchText}
                        onlyLike={this.state.onlyLike}
                    />
                </CHBody>
            </ContentHolder>
        );
    }
}