class ContainerProfileSearchItemList extends React.Component {
    render() {
        return (
            <Motion.motion.div
                variants={{
                    hidden: {opacity: 0, height: 0},
                    show: {
                        opacity: 1, height: "auto", transition: {staggerChildren: 0.2}
                    },
                    exit: {height: 0, transition: {staggerChildren: 0.2}}
                }}
                style={{maxHeight: "250px"}}
                initial="hidden"
                animate="show"
                exit="exit"
            >
                {this.props.children}
            </Motion.motion.div>
        );
    }
}

class ContainerProfileSearchItem extends React.Component {
    render() {
        return (
            <Motion.motion.div
                variants={{
                    hidden: {opacity: 0, y: -20},
                    show: {opacity: 1, y: 0},
                    exit: {opacity: 0, y: 20}
                }}
                className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center">
                    <ItemAvatar size="40px" />
                    <div className="ms-2">
                        <p className="m-0" style={{fontWeight: "bold"}}>{this.props.name}</p>
                        <div className="d-flex align-items-center">
                            <div className={`blob ${this.props.color}`} />
                            <p className="m-0" style={{fontSize: "10pt", fontWeight: "bold", color: "var(--sys-gray)"}}>
                                {this.props.description}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="cursor-pointer" style={{rotate: "320deg"}} onClick={this.props.trigger}>
                    <ion-icon name="arrow-forward-outline" />
                </div>
            </Motion.motion.div>
        );
    }
}

class ContainerProfileSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchPreview: "all",
            search: ""
        }
    }

    getTrendColor(comments) {
        return comments.length > 1 ? comments.length > 3 ? comments.length > 9 ? comments.length > 14 ? "red" : "orange" : "yellow" : "blue" : "gray";
    }

    getSearchResults() {
        switch (this.state.searchPreview) {
            case "suggestions":
                return <ContainerProfileSearchItemList key="suggestions">
                    {
                        getDH("students").concat(getDH("teachers"))
                            .filter(p => p.name.firstname.toLowerCase().includes(this.state.search.toLowerCase()) ||
                                p.name.lastname.toLowerCase().includes(this.state.search.toLowerCase()))
                            .map(p => {
                                let id = p.studentId ? p.studentId : p.teacherId,
                                    comments = getDH("comments").filter(f => f.personId === id);
                                return <ContainerProfileSearchItem
                                    key={id}
                                    name={`${p.name.firstname} ${p.name.lastname}`}
                                    description={`${comments.length} Kommentare`}
                                    color={this.getTrendColor(comments)}
                                    trigger={()=> setParam("p", id)}
                                />
                            })
                    }
                </ContainerProfileSearchItemList>
            case "all":
                return <ContainerProfileSearchItemList key="all">
                    {
                        getDH("students").concat(getDH("teachers"))
                            .sort((a, b) => {
                                let aId = a.studentId === undefined ? a.teacherId : a.studentId,
                                    bId = b.studentId === undefined ? b.teacherId : b.studentId;
                                return getDH("comments").filter(f => f.personId === bId).length - getDH("comments").filter(f => f.personId === aId).length
                            })
                            .slice(0,5)
                            .map(p => {
                                let id = p.studentId ? p.studentId : p.teacherId,
                                    comments = getDH("comments").filter(f => f.personId === id);
                                return <ContainerProfileSearchItem
                                    key={id}
                                    name={`${p.name.firstname} ${p.name.lastname}`}
                                    description={`${comments.length} Kommentare`}
                                    color={this.getTrendColor(comments)}
                                    trigger={()=> setParam("p", id)}
                                />
                            })
                    }
                </ContainerProfileSearchItemList>
            case "students":
                return <ContainerProfileSearchItemList key="students">
                    {
                        getDH("students")
                            .sort((a, b) => getDH("comments").filter(f => f.personId === b.studentId).length - getDH("comments").filter(f => f.personId === a.studentId).length)
                            .slice(0, 5)
                            .map(s => {
                                let comments = getDH("comments").filter(f => f.personId === s.studentId);
                                return <ContainerProfileSearchItem
                                    key={s.studentId}
                                    name={`${s.name.firstname} ${s.name.lastname}`}
                                    description={`${comments.length} Kommentare`}
                                    color={comments.length > 1 ? comments.length > 4 ? comments.length > 9 ? comments.length > 14 ? "red" : "yellow" : "orange" : "blue" : "gray"}
                                    trigger={() => setParam("p", s.studentId)}
                                />
                            })
                    }
                </ContainerProfileSearchItemList>
            case "teachers":
                return <ContainerProfileSearchItemList key="teachers">
                    {
                        getDH("teachers")
                            .sort((a, b) => getDH("comments").filter(f => f.personId === b.teacherId).length - getDH("comments").filter(f => f.personId === a.teacherId).length)
                            .slice(0, 5)
                            .map(t => {
                                let comments = getDH("comments").filter(f => f.personId === t.teacherId);
                                return <ContainerProfileSearchItem
                                    key={t.teacherId}
                                    name={`${t.name.firstname} ${t.name.lastname}`}
                                    description={`${comments.length} Kommentare`}
                                    color={comments.length > 1 ? comments.length > 4 ? comments.length > 9 ? comments.length > 14 ? "red" : "yellow" : "orange" : "blue" : "gray"}
                                    trigger={() => setParam("p", t.teacherId)}
                                />
                            })
                    }
                </ContainerProfileSearchItemList>
            default:
                return <ContainerInformationBanner
                    icon="search-outline"
                    color="var(--sys-gray)"
                    title="Kein Suchergebniss"
                    description="Ändere Kategorie oder Eingabe, um ein passendes Ergebniss zu erzielen."
                />
        }
    }

    render() {
        let latestComment = getDH("comments")
                .sort((a, b) => new Date(b.published.date).getTime() - new Date(a.published.date).getTime())[0],
            topComment = getDH("comments").sort((a, b) => b.likes.length - a.likes.length)[0];

        return (
            <div className="d-sm-flex justify-content-sm-center align-items-center w-100 h-100">
                <div className="col-12 col-sm-6 roundContainer">
                    <div className="roundContainerInner" style={{borderRadius: "8px 8px 0 0"}}>
                        <div className="d-flex align-items-center justify-content-between">
                            <p className="mb-2" style={{fontWeight: "550"}}>Top Kommentar</p>
                            <ItemLikeButton
                                trigger={this.like}
                                liked={topComment.likes.find(f => f.studentId === getDH("identity").studentId) !== undefined}
                                count={topComment.likes.length}
                                horizontal={true}
                            />
                        </div>

                        <p className="mb-1" style={{fontSize: "11pt"}}>{topComment.comment}</p>
                        <div className="d-flex justify-content-between align-items-center me-1"
                             onClick={() => setParam("p",topComment.personId)}>
                            <p className="mb-0" style={{fontSize: "10pt", fontWeight: "bold", color: "var(--sys-gray)"}}>
                                {findPerson(topComment.personId).name.firstname} {findPerson(topComment.personId).name.lastname}️
                            </p>
                            <div className="cursor-pointer" style={{rotate: "45deg"}}>
                                <ion-icon name="arrow-up-outline" />
                            </div>
                        </div>
                    </div>
                    <div className="roundContainerInner pb-1 pt-2" style={{backgroundColor: "var(--sys-gray5)", borderRadius: "0 0 8px 8px"}}>
                        <p className="mb-2" style={{fontSize: "11pt", fontWeight: "550"}}>Zuletzt hinzugefügt</p>

                        <p className="mb-1" style={{fontSize: "11pt"}}>{latestComment.comment}</p>
                        <div className="d-flex justify-content-between align-items-center me-1"
                             onClick={() => setParam("p", latestComment.personId)}>
                            <p className="mb-0" style={{fontSize: "10pt", fontWeight: "bold", color: "var(--sys-gray)"}}>
                                {findPerson(latestComment.personId).name.firstname} {findPerson(latestComment.personId).name.lastname}
                            </p>
                            <div className="cursor-pointer" style={{rotate: "45deg"}}>
                                <ion-icon name="arrow-up-outline" />
                            </div>
                        </div>
                    </div>

                    <div className="roundContainerInner shadow-sm mt-4" style={{borderRadius: "8px 8px 0 0"}}>
                        <input className="createInput" placeholder="🔍 Suchen" type="text" style={{fontSize: "14pt"}}
                               onKeyDown={e => { if (e.keyCode === 13) this.props.onEnter()}}
                               onInput={event => {
                                   this.setState({
                                       search: event.currentTarget.value,
                                       searchPreview: event.currentTarget.value.length === 0 ? "all" : "suggestions"
                                   })
                               }}/>
                    </div>
                    <div className="roundContainerInner shadow-sm" style={{borderRadius: "0 0 8px 8px", backgroundColor: "var(--sys-gray5)"}}>
                        <label>
                            <select className="py-1 align-text-bottom contentHeaderSorting" value={this.state.searchPreview}
                                    style={{fontSize: "11pt", fontWeight: "bold", color: "var(--sys-gray)"}}
                                    onChange={e => this.setState({searchPreview: e.target.value})}>
                                <option value="all">▼ Im Trend</option>
                                <option value="teachers">▼ Lehrer im Trend</option>
                                <option value="students">▼ Schüler im Trend</option>
                                <option value="suggestions" disabled={true}>Vorschläge</option>
                            </select>
                        </label>
                        <Motion.AnimatePresence>
                            {this.getSearchResults()}
                        </Motion.AnimatePresence>
                    </div>
                </div>
                <div className="col-12 col-sm-5 ms-sm-4 my-4 my-sm-0">
                    <div className="roundContainerInner overflow-hidden">
                        <div className="d-flex">
                            <h5>Alle Profile</h5>
                        </div>
                        <div className="userListContainer">
                            {
                                getDH("students").concat(getDH("teachers"))
                                    .sort((a, b) => a.name.firstname.localeCompare(b.name.firstname))
                                    .map(p => {
                                        let id = p.studentId ? p.studentId : p.teacherId,
                                            comments = getDH("comments").filter(f => f.personId === id);
                                        return <ContainerProfileSearchItem
                                            key={id}
                                            name={`${p.name.firstname} ${p.name.lastname}`}
                                            description={`${comments.length} Kommentare`}
                                            color={this.getTrendColor(comments)}
                                            trigger={()=> setParam("p", id)}
                                        />
                                    })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class ContainerProfileQuestionAddPopup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {addQuestionPopup: false, question: ""}
    }

    add = async () => {
        api(`/student/question/add/${this.state.question}`, "POST", null)
            .then(v => {
                this.setState({addQuestionPopup: false})
                modifyDataDH("questions", v.data)
            })
    }

    render() {
        return (
            <>
                {this.state.addQuestionPopup && (
                    <Popup toggle={() => this.setState({addQuestionPopup: false})}>
                        <PPContent>
                            <PPHeadingIcon icon="help" color="var(--sys-gray)" />
                            <PPHeading>Frage hinzufügen</PPHeading>
                            <PPDescription>Jeder Schüler kann diese Frage unter seinem Profil beantworten.</PPDescription>
                            <PPInputText
                                placeholder="Frage"
                                onValid={v => validateLength(v, 0, 99999999)}
                                onInput={v => this.setState({question: v})}
                                onEnter={this.add}
                            />
                        </PPContent>

                        <PPButton trigger={this.add} disabled={validateLength(this.state.question, 1, 999999)}
                                  color="#fff" bgColor="var(--sys-blue)">Hinzufügen</PPButton>
                    </Popup>
                )}
                <Motion.motion.div
                    onClick={() => this.setState({addQuestionPopup: !this.state.addQuestionPopup})}
                    whileHover={{backgroundColor: "var(--sys-gray5)", color: "var(--sys-gray)"}}
                    className="mt-4 py-1 mx-2 cursor-pointer d-flex justify-content-center"
                    style={{backgroundColor: "var(--sys-gray6)", color: "var(--sys-gray)", border: "1px solid var(--sys-gray)", borderRadius: "8px"}}>

                    <p className="m-0">Frage hinzufügen</p>
                </Motion.motion.div>
            </>
        );
    }
}

class ContainerProfileQuestion extends React.Component {
    constructor() {
        super();

        this.state = {deletionPopup: false, answer: ""}
    }

    getAnswerElement() {
        let studentId = getParam("p");
        if (this.props.question.answers[studentId] !== undefined) {
            return <>
                <p className="m-0" style={{fontSize: "11pt"}}>{this.props.question.answers[studentId]}</p>
                <Motion.motion.div
                    className="cursor-pointer"
                    initial={{color: "var(--sys-gray2)"}}
                    whileHover={{color: "var(--sys-red)"}}
                    whileTap={{scale: 0.9}}
                    onClick={this.removeAnswer}
                >
                    <ion-icon className="text-end" name={"remove-circle"} style={{color: "currentColor"}} />
                </Motion.motion.div>
            </>
        }

        if (studentId === getDH("identity").studentId) {
            return <>
                <ItemInput
                    placeholder="Deine Antwort"
                    onInput={(v) => this.setState({answer: v})}
                    onEnter={this.setAnswer}
                    onValid={() => ""}
                />
                <Motion.motion.div
                    className="cursor-pointer mt-2"
                    initial={{color: "var(--sys-gray2)"}}
                    whileHover={{color: "var(--sys-green)"}}
                    whileTap={{scale: 0.9}}
                    onClick={this.setAnswer}
                >
                    <ion-icon className="text-end" name={"add-circle"} style={{color: "currentColor"}} />
                </Motion.motion.div>
            </>
        }

        return <>
            <ion-icon name="hourglass-outline"/>
            <p className="ps-2 m-0" style={{color: "var(--sys-gray)", fontSize: "11pt", fontWeight: "bold"}}>Nicht beantwortet</p>
        </>
    }

    setAnswer = async () => {
        return api(`/student/question/${this.props.question.questionId}/answer/${this.state.answer}`, "POST", null)
            .then(v => modifyDataDH("questions", getDH("questions")
                .map(question => question.questionId === this.props.question.questionId ? v.data : question)))
    }

    removeQuestion = async () => {
        return api(`/student/question/${this.props.question.questionId}/remove`, "POST", null)
            .then(v => {
                this.setState({deletionPopup: false})
                modifyDataDH("questions", v.data)
            })
    }

    removeAnswer = async () => {
        return api(`/student/question/${this.props.question.questionId}/answer/remove`, "POST", null)
            .then(v => modifyDataDH("questions", getDH("questions")
                .map(question => question.questionId === this.props.question.questionId ? v.data : question)))
    }

    render() {
        return (
            <>
                {this.state.deletionPopup && (
                    <Popup toggle={() => this.setState({deletionPopup: false})}>
                        <PPContent>
                            <PPHeadingIcon icon="help" color="var(--sys-gray)" />
                            <PPHeading>Frage entfernen</PPHeading>
                            <PPDescription>Bist du sicher, dass du die Frage auf allen Profilen endgültig entfernen willst?</PPDescription>
                        </PPContent>

                        <PPButton
                            trigger={() => this.setState({deletionPopup: false})}
                            color="var(--sys-black)"
                            bgColor="var(--sys-gray6)"
                        >
                            Abbruch
                        </PPButton>
                        <PPButton
                            trigger={this.removeQuestion}
                            color="#fff"
                            bgColor="var(--sys-red)"
                        >
                            Löschen
                        </PPButton>
                    </Popup>
                )}
                <div className="roundContainer mb-2">
                    <div className="roundContainerInner d-flex justify-content-between align-items-center" style={{backgroundColor: "var(--sys-gray5)", borderRadius: "10px 10px 0 0"}}>
                        <p className="m-0" style={{fontSize: "11pt", fontWeight: "bold"}}>{this.props.question.question}</p>
                        {hasPermission("question.remove") && (
                            <Motion.motion.div
                                className="cursor-pointer"
                                initial={{color: "var(--sys-gray2)"}}
                                whileHover={{color: "var(--sys-red)"}}
                                whileTap={{scale: 0.9}}
                                onClick={() => this.setState({deletionPopup: true})}
                            >
                                <ion-icon className="text-end" name={"remove-circle"} style={{color: "currentColor"}} />
                            </Motion.motion.div>
                        )}
                    </div>
                    <div className={`roundContainerInner d-flex align-items-center ${getParam("p") === getDH("identity").studentId && this.props.question.answers[getParam("p")] !== undefined ? "justify-content-between" : "justify-content-center"}`} style={{borderRadius: "0 0 10px 10px"}}>
                        {this.getAnswerElement()}
                    </div>
                </div>
            </>
        );
    }
}

class ContainerProfileCommentAddPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {comment: ""}
    }


    add = async () => {
        api(`/student/comment/${getParam("p")}/add/${this.state.comment}`, "POST", null)
            .then(value => {
                this.props.toggle()
                modifyDataDH("comments", value.data)
            })
    }

    render() {
        return (
            <Popup toggle={() => this.props.toggle()}>
                <PPContent>
                    <PPHeadingIcon icon={"chatbubble-outline"} color={"var(--sys-gray)"}/>
                    <PPHeading>Kommentar hinzufügen</PPHeading>
                    <PPInputText
                        placeholder="Kommentar"
                        onValid={v => validateLength(v, 2, 150)}
                        onInput={v => this.setState({comment: v})}
                        onEnter={this.add}
                    />
                </PPContent>

                <PPButton trigger={this.add} disabled={validateLength(this.state.comment, 2, 400)}
                          color="#fff" bgColor="var(--sys-blue)">Hinzufügen</PPButton>
            </Popup>
        );
    }
}

class ContainerProfileComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {deletionPopup: false}
    }

    like = async () => {
        api(`/student/comment/${this.props.comment.commentId}/like`, "POST", null)
            .then(value => modifyDataDH("comments", getDH("comments").map(c =>
                c.commentId === this.props.comment.commentId ? value.data : c)))
    }

    delete = async () => {
        api(`/student/comment/${this.props.comment.commentId}/delete`, "POST", null)
            .then(value => {
                modifyDataDH("comments", value.data)
                this.setState({deletionPopup: false})
            })
    }

    render() {
        return (
            <>
                {
                    this.state.deletionPopup && (
                        <Popup toggle={() => this.setState({deletionPopup: false})}>
                            <PPContent>
                                <PPHeadingIcon icon={"trash-outline"} color={"var(--sys-red)"} />
                                <PPHeading>Kommentar Löschen</PPHeading>
                                <PPDescription>
                                    Möchtest du den Kommentar "{this.props.comment.comment}" wirklich endgültig löschen?
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
                    )
                }
                <Motion.motion.div
                    className="comment d-flex justify-content-between align-items-center"
                    variants={{
                        hidden: {opacity: 0, x: -10},
                        show: {opacity: 1, x: 0},
                        exit: {opacity: 0, x: 10}
                    }}
                >
                    <p>{this.props.comment.comment}</p>
                    <div className="d-flex justify-content-between align-items-center">
                        <ItemLikeButton
                            trigger={this.like}
                            liked={this.props.comment.likes.find(f => f.studentId === getDH("identity").studentId) !== undefined}
                            count={this.props.comment.likes.length}
                            horizontal={true}
                        />
                        {
                            hasPermission("comment.delete.own") && this.props.comment.published.studentId === getDH("identity").studentId
                            || this.props.comment.personId === getDH("identity").studentId
                            || hasPermission("comment.delete") ?
                                <Motion.motion.div
                                    className="cursor-pointer"
                                    initial={{color: "var(--sys-gray2)"}}
                                    whileHover={{color: "var(--sys-red)"}}
                                    whileTap={{scale: 0.9}}
                                    onClick={() => this.setState({deletionPopup: true})}
                                >
                                    <ion-icon className="text-end"
                                              name={"remove-circle"} style={{color: "currentColor"}} />
                                </Motion.motion.div>
                                : null
                        }
                    </div>
                </Motion.motion.div>
            </>
        );
    }
}

class ContainerProfileInspect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {addCommentPopup: false}
    }

    getRoleBadgeElement() {
        if (this.props.person.teacherId) return <div className="profileBadge" style={{color: "#00a83b"}}>Kollegium</div>

        let highestRole = {powerLvl: -1};
        this.props.person.roles.forEach(roleId => {
            let role = getDH("roles").find(f => f.roleId === roleId);
            if (role.powerLvl > highestRole.powerLvl) highestRole = role
        })

        return <>
            {this.props.person.roles.map(roleId => {
                let role = getDH("roles").find(f => f.roleId === roleId);
                if (role.powerLvl === 0) return null
                return <div className="profileBadge" style={{color: role.hexColor}}>
                    {role.name}
                </div>
            })}
        </>
    }

    render() {
        return (
            <>
                {
                    this.state.addCommentPopup && (
                        <ContainerProfileCommentAddPopup toggle={() => this.setState({addCommentPopup: false})} />
                    )
                }
                <div className="d-flex justify-content-center w-100">
                    <div className="col-12 col-md-10 mt-4">
                        <div className="row row-cols-2 justify-content-between">
                            <div className="col-12 col-md-6">
                                <div className="d-flex align-items-center m-1">
                                    <ItemAvatar size="60px" />
                                    <div className="ms-3">
                                        <p className="m-0" style={{fontSize: "16pt"}}>
                                            {this.props.person.name.firstname} {this.props.person.name.lastname}
                                        </p>
                                        <p className="m-0" style={{color: "var(--sys-gray)"}}>
                                            {this.props.person.nickname}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 row mx-1 mx-md-0 justify-content-md-end">
                                {
                                    this.props.person.birthday && new Date(this.props.person.birthday).getFullYear() > 2000 ?
                                        <div className="profileBadge" style={{color: "#FEBBCC"}}>
                                            🎉 {("0" + new Date(this.props.person.birthday).getDate()).slice(-2)}.{("0" + (new Date(this.props.person.birthday).getMonth()+1)).slice(-2)}.{new Date(this.props.person.birthday).getFullYear()}
                                        </div>
                                        : null
                                }
                                {this.getRoleBadgeElement()}
                            </div>
                        </div>
                        <div className="row row-cols-2 mt-3">
                            {this.props.person.studentId !== undefined && (
                                <div className="col-12 col-md-5">
                                    {this.props.questions.length > 0 ?
                                        this.props.questions.map(question =>
                                            <ContainerProfileQuestion key={question.questionId} question={question}/>
                                        )
                                        :
                                        <ContainerInformationBanner
                                            icon="help"
                                            color="var(--sys-gray)"
                                            title="Keine Fragen"
                                            description={`Es wurden noch keine Fragen erstellt.`}
                                        />
                                    }
                                    {hasPermission("question.add") && (<ContainerProfileQuestionAddPopup />)}
                                </div>
                            )}
                            <div className={`col-12 col-md-7 pt-4 pt-sm-0 ${this.props.person.studentId === undefined && ("col-md-12")}`}>
                                <div className="mx-2 mx-md-0"
                                     style={{padding: "1rem", border: "2px var(--sys-gray4) dashed", borderRadius: "12px"}}>
                                    <div className="d-flex justify-content-between">
                                        <p style={{fontWeight: 550}}>Kommentare</p>
                                        <Motion.motion.div
                                            className="cursor-pointer"
                                            initial={{color: "var(--sys-gray2)"}}
                                            whileHover={{color: "var(--sys-green)"}}
                                            whileTap={{scale: 0.9}}
                                            onClick={() => this.setState({addCommentPopup: true})}
                                        >
                                            <ion-icon name="add-circle" style={{color: "currentColor"}} />
                                        </Motion.motion.div>
                                    </div>
                                    {
                                        this.props.comments.length > 0 ?
                                            <Motion.AnimatePresence>
                                                <Motion.motion.div
                                                    variants={{
                                                        hidden: {height: 0},
                                                        show: {height: "auto", transition: {staggerChildren: 0.1}},
                                                        exit: {transition: {staggerChildren: 0.1}}
                                                    }}
                                                    className="overflow-hidden"
                                                    initial="hidden"
                                                    animate="show"
                                                    exit="exit"
                                                    key={this.props.key}
                                                >
                                                    {this.props.comments.map(c => <ContainerProfileComment comment={c} key={c.commentId} />)}
                                                </Motion.motion.div>
                                            </Motion.AnimatePresence>
                                            :
                                            <ContainerInformationBanner
                                                icon="chatbubbles-outline"
                                                color="var(--sys-gray)"
                                                title="Keine Kommentare"
                                                description={`Keine Kommentare über ${this.props.person.name.firstname} gefunden.`}
                                            />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

class ContainerProfile extends React.Component {
    render() {
        let person;
        if (this.props.personId) person = getDH("students").concat(getDH("teachers")).find(f => {
            if (f.studentId !== undefined) return f.studentId === this.props.personId
            return f.teacherId === this.props.personId
        })

        let latestComment = getDH("comments")
            .sort((a, b) => new Date(b.published.date).getTime() - new Date(a.published.date).getTime())[0],
            topComment = getDH("comments").sort((a, b) => b.likes.length - a.likes.length)[0];

        return (
            <>
                {
                    person ?
                        <ContainerProfileInspect
                            person={person}
                            comments={getDH("comments").filter(f => f.personId === this.props.personId)}
                            questions={getDH("questions")}
                        />
                        :
                        /*<div className="px-2">
                            <div className="row row-cols-2">
                                <div className="col-7 roundContainer h-100">
                                    <div className="roundContainerInner h-100" style={{backgroundColor: "var(--bg-content)", border: "3px dashed var(--sys-gray6)"}}>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <h5>Profile im Trend</h5>
                                        </div>
                                        <div className="container row justify-content-between w-100" style={{overflowX: "auto", whiteSpace: "nowrap"}}>
                                            <div className="col-4 roundContainerInner d-flex flex-column align-items-center" style={{width: "auto"}}>
                                                <ItemAvatar size="48px"/>
                                                <p className="mb-0" style={{fontSize: "11pt", fontWeight: "550"}}>Herr Indris</p>
                                                <div className="d-flex align-items-center justify-content-between w-75">
                                                    <div className="text-center">
                                                        <ion-icon name="chatbox" style={{color: "var(--sys-gray4)", fontSize: "15pt"}} />
                                                        <p className="mb-0" style={{fontSize: "9pt", fontWeight: "bold", color: "var(--sys-gray)"}}>5</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <ion-icon name="heart"
                                                                  style={{color: "var(--sys-gray4)", fontSize: "15pt"}} />
                                                        <p className="mb-0" style={{fontSize: "9pt", fontWeight: "bold", color: "var(--sys-gray)"}}>20</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-4 roundContainerInner d-flex flex-column align-items-center" style={{width: "auto"}}>
                                                <ItemAvatar size="48px"/>
                                                <p className="mb-0" style={{fontSize: "11pt", fontWeight: "550"}}>Herr Indris</p>
                                                <div className="d-flex align-items-center justify-content-between w-75">
                                                    <div className="text-center">
                                                        <ion-icon name="chatbox" style={{color: "var(--sys-gray4)", fontSize: "15pt"}} />
                                                        <p className="mb-0" style={{fontSize: "9pt", fontWeight: "bold", color: "var(--sys-gray)"}}>5</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <ion-icon name="heart"
                                                                  style={{color: "var(--sys-gray4)", fontSize: "15pt"}} />
                                                        <p className="mb-0" style={{fontSize: "9pt", fontWeight: "bold", color: "var(--sys-gray)"}}>20</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-4 roundContainerInner d-flex flex-column align-items-center" style={{width: "auto"}}>
                                                <ItemAvatar size="48px"/>
                                                <p className="mb-0" style={{fontSize: "11pt", fontWeight: "550"}}>Herr Indris</p>
                                                <div className="d-flex align-items-center justify-content-between w-75">
                                                    <div className="text-center">
                                                        <ion-icon name="chatbox" style={{color: "var(--sys-gray4)", fontSize: "15pt"}} />
                                                        <p className="mb-0" style={{fontSize: "9pt", fontWeight: "bold", color: "var(--sys-gray)"}}>5</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <ion-icon name="heart"
                                                                  style={{color: "var(--sys-gray4)", fontSize: "15pt"}} />
                                                        <p className="mb-0" style={{fontSize: "9pt", fontWeight: "bold", color: "var(--sys-gray)"}}>20</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-4 roundContainerInner d-flex flex-column align-items-center" style={{width: "auto"}}>
                                                <ItemAvatar size="48px"/>
                                                <p className="mb-0" style={{fontSize: "11pt", fontWeight: "550"}}>Herr Indris</p>
                                                <div className="d-flex align-items-center justify-content-between w-75">
                                                    <div className="text-center">
                                                        <ion-icon name="chatbox" style={{color: "var(--sys-gray4)", fontSize: "15pt"}} />
                                                        <p className="mb-0" style={{fontSize: "9pt", fontWeight: "bold", color: "var(--sys-gray)"}}>5</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <ion-icon name="heart"
                                                                  style={{color: "var(--sys-gray4)", fontSize: "15pt"}} />
                                                        <p className="mb-0" style={{fontSize: "9pt", fontWeight: "bold", color: "var(--sys-gray)"}}>20</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-4 roundContainerInner d-flex flex-column align-items-center" style={{width: "auto"}}>
                                                <ItemAvatar size="48px"/>
                                                <p className="mb-0" style={{fontSize: "11pt", fontWeight: "550"}}>Herr Indris</p>
                                                <div className="d-flex align-items-center justify-content-between w-75">
                                                    <div className="text-center">
                                                        <ion-icon name="chatbox" style={{color: "var(--sys-gray4)", fontSize: "15pt"}} />
                                                        <p className="mb-0" style={{fontSize: "9pt", fontWeight: "bold", color: "var(--sys-gray)"}}>5</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <ion-icon name="heart"
                                                                  style={{color: "var(--sys-gray4)", fontSize: "15pt"}} />
                                                        <p className="mb-0" style={{fontSize: "9pt", fontWeight: "bold", color: "var(--sys-gray)"}}>20</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-4 roundContainerInner d-flex flex-column align-items-center" style={{width: "auto"}}>
                                                <ItemAvatar size="48px"/>
                                                <p className="mb-0" style={{fontSize: "11pt", fontWeight: "550"}}>Herr Indris</p>
                                                <div className="d-flex align-items-center justify-content-between w-75">
                                                    <div className="text-center">
                                                        <ion-icon name="chatbox" style={{color: "var(--sys-gray4)", fontSize: "15pt"}} />
                                                        <p className="mb-0" style={{fontSize: "9pt", fontWeight: "bold", color: "var(--sys-gray)"}}>5</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <ion-icon name="heart"
                                                                  style={{color: "var(--sys-gray4)", fontSize: "15pt"}} />
                                                        <p className="mb-0" style={{fontSize: "9pt", fontWeight: "bold", color: "var(--sys-gray)"}}>20</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-5 roundContainer h-100">
                                    <div className="roundContainerInner" style={{borderRadius: "8px 8px 0 0"}}>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <p className="mb-2" style={{fontWeight: "550"}}>Top Kommentar</p>
                                            <ItemLikeButton
                                                trigger={this.like}
                                                liked={topComment.likes.find(f => f.studentId === getDH("identity").studentId) !== undefined}
                                                count={topComment.likes.length}
                                                horizontal={true}
                                            />
                                        </div>

                                        <p className="mb-1" style={{fontSize: "11pt"}}>{topComment.comment}</p>
                                        <div className="d-flex justify-content-between align-items-center me-1"
                                             onClick={() => setParam("p",topComment.personId)}>
                                            <p className="mb-0" style={{fontSize: "10pt", fontWeight: "bold", color: "var(--sys-gray)"}}>
                                                {findPerson(topComment.personId).name.firstname} {findPerson(topComment.personId).name.lastname}️
                                            </p>
                                            <div className="cursor-pointer" style={{rotate: "45deg"}}>
                                                <ion-icon name="arrow-up-outline" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="roundContainerInner pb-1 pt-2" style={{backgroundColor: "var(--sys-gray5)", borderRadius: "0 0 8px 8px"}}>
                                        <p className="mb-2" style={{fontSize: "11pt", fontWeight: "550"}}>Zuletzt hinzugefügt</p>

                                        <p className="mb-1" style={{fontSize: "11pt"}}>{latestComment.comment}</p>
                                        <div className="d-flex justify-content-between align-items-center me-1"
                                             onClick={() => setParam("p", latestComment.personId)}>
                                            <p className="mb-0" style={{fontSize: "10pt", fontWeight: "bold", color: "var(--sys-gray)"}}>
                                                {findPerson(latestComment.personId).name.firstname} {findPerson(latestComment.personId).name.lastname}
                                            </p>
                                            <div className="cursor-pointer" style={{rotate: "45deg"}}>
                                                <ion-icon name="arrow-up-outline" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>*/
                        <>
                            <ContainerProfileSearch />
                        </>
                }
            </>
        );
    }
}

class ContentProfile extends React.Component {
    constructor(props) {
        super(props);

        this.interval = setInterval(() => {
            this.setState({personId: new URLSearchParams(window.location.search).get("p")})
            if (DHUpdated) { this.setState({age: this.state.age++}); DHUpdated = false}
            }, 100)
        this.state = {age: 0, personId: new URLSearchParams(window.location.search).get("p")}
    }
    componentWillUnmount() {clearInterval(this.interval)}


    render() {
        return (
            <ContentHolder>
                <CHHeading>
                    <ActionBar>
                        <ABButton key="1" trigger={() => removeParam("p")} icon="apps-outline" />
                    </ActionBar>

                    <Header title="Profile" color="#00C9A7" />
                </CHHeading>
                <CHBody>
                    <ContainerProfile personId={this.state.personId}/>
                </CHBody>
            </ContentHolder>
        );
    }
}