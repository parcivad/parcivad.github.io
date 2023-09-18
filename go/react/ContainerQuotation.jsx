class ContainerQuotationElement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {deletionPopup: false}
    }


    like = async () => {
        return await api(`/student/quotation/${this.props.quotation.quotationId}/like`, "POST", null)
            .then(value => modifyDataDH("quotations", getDH("quotations")
                .map(quotation => quotation.quotationId === this.props.quotation.quotationId ? value.data : quotation)))
            .catch(error => { return error; })
    }

    delete = async () => {
        return await api(`/student/quotation/${this.props.quotation.quotationId}/delete`, "POST", null)
            .then(value => modifyDataDH("quotations", value.data))
            .catch(error => { return error; })
    }

    deleteElement() {
        if (!hasPermission(Permission.QUOTATION_DELETE)
            && !hasPermission(Permission.QUOTATION_DELETE_OWN)) return <></>;

        if (!hasPermission(Permission.QUOTATION_DELETE) && hasPermission(Permission.QUOTATION_DELETE_OWN)
            && this.props.quotation.quotePublish.studentId !== getDH("identity").studentId) return <></>;

        return <div className="icon-button" onClick={() => this.setState({deletionPopup: true})}>
            <Motion.motion.div
                initial={{color: "var(--sys-gray)", y: 0}}
                whileHover={{
                    color: "var(--sys-red)",
                    y: 5,
                    transition: { duration: 0.4 },
                }}
            >
                <ion-icon name={"trash-outline"} style={{color: "currentColor"}} />
            </Motion.motion.div>
        </div>
    }

    publisherElement() {
        let publisher = {firstname: "anonym", lastname: "anonym"};
        if (hasPermission(Permission.QUOTATION_SHOW_PUBLISHER))
            publisher = getDH("students").find(s => s.studentId === this.props.quotation.quotePublish.studentId).name
        let publishedBy = `${publisher["firstname"]} ${publisher["lastname"]}`

        if (this.props.quotation.quotePublish.studentId === getDH("identity").studentId)
            return <p className="text-end pt-3 m-0" style={{fontSize: "10pt", color: "var(--sys-gray2)"}}>
                von <span style={{"fontWeight": "bold"}}>Dir</span>
            </p>

        if (!hasPermission(Permission.QUOTATION_SHOW_PUBLISHER)) return <></>;

        return <p className="text-end pt-3 m-0" style={{fontSize: "10pt", color: "var(--sys-gray2)"}}>
            von <span style={{"fontWeight": "bold"}}>{publishedBy}</span>
        </p>
    }

    render()  {
        let publisher = {firstname: "anonym", lastname: "anonym"};
        if (hasPermission(Permission.QUOTATION_SHOW_PUBLISHER))
            publisher = getDH("students").find(s => s.studentId === this.props.quotation.quotePublish.studentId).name
        let publishedBy = `${publisher["firstname"]} ${publisher["lastname"]}`,
            liked = this.props.quotation.likes.find(like => like["studentId"] === getDH("identity")["studentId"]) !== undefined,
            date = timeToString(new Date(this.props.quotation.quotePublish.date))


        return (
            <>
                {this.state.deletionPopup ?
                    <Popup toggle={() => this.setState({deletionPopup: false})}>
                        <PPContent>
                            <PPHeadingIcon icon={"trash-outline"} color={"var(--sys-red)"} />
                            <PPHeading>Zitat Löschen</PPHeading>
                            <PPDescription>
                                Möchtest du das Zitat wirklich endgültig löschen?
                            </PPDescription>
                            <div className={"pt-2"}>
                                <PPDescription>
                                    Zitat: <mark>{this.props.quotation.quote.text}</mark>
                                </PPDescription>
                            </div>
                            <div className={"pt-2"}>
                                <PPDescription>
                                    Zitiert: <mark>{this.props.quotation.quote.from}</mark>
                                </PPDescription>
                            </div>
                            <div className={"pt-2"}>
                                <PPDescription>
                                    Veröffentlicht von: <mark>{publishedBy}</mark>
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
                    initial={{ opacity: 0 , y: -30,}}
                    animate={{ opacity: 1 , y: 0}}
                    transition={{
                        duration: 1,
                        delay: this.props.delay,
                        ease: [0, 0.3, 0.6, 1.01]
                    }}
                >
                    <div className="py-3 quotation">
                        <div className="quotationBlock">
                            <div className="row row-cols-2 ps-4 pe-3 pt-3 pb-2">
                                <div className="col-10 d-flex">
                                    <h5>{this.props.quotation.quote.text}</h5>
                                </div>
                                <div className="col-2 text-end">
                                    <div className="d-inline-block justify-content-end">
                                        <ItemLikeButton
                                            trigger={this.like}
                                            liked={liked}
                                            count={this.props.quotation.likes.length} />

                                        {this.deleteElement()}
                                    </div>
                                </div>
                                <div className="col-8 d-flex">
                                    <div className="">
                                        <p className="m-0">~ {this.props.quotation.quote.from}</p>
                                        <p className="m-0 text-secondary" style={{fontSize: "10pt"}}>{date}</p>
                                    </div>
                                </div>
                                <div className="col-4">
                                    {this.publisherElement()}
                                </div>
                            </div>
                        </div>
                    </div>
                </Motion.motion.div>
            </>
        );
    }
}

class ContainerAddQuotation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: "",
            from: ""
        }
    }

    addQuotation = async () => {
        api(`/student/quotation/create`, "POST", JSON.stringify({
            "text": this.state.text,
            "from": this.state.from,
        }))
            .then(value => {
                modifyDataDH("quotation", value.data)
                this.props.toggle()
            })
            .catch(error => {return error})
    }

    render() {
        return (
            <>
                <Popup toggle={() => this.props.toggle()}>
                    <PPContent>
                        <PPHeadingIcon icon={"pencil-outline"} color={"var(--sys-gray)"}/>
                        <PPHeading>Zitat erstellen</PPHeading>
                        <PPDescription>Erstelle ein Zitat von einem Schüler oder Lehrer und lasse andere Schüler dein Zitat liken.</PPDescription>
                        <PPInputText
                            placeholder="Zitat"
                            onValid={v => validateLength(v, 5, 150)}
                            onInput={v => this.setState({text: v})}
                            onEnter={() => $("#qc2").focus()}
                        />
                        <PPInputText
                            id="qc2"
                            placeholder="Person"
                            onValid={v => validateLength(v, 5, 150)}
                            onInput={v => this.setState({from: v})}
                            onEnter={() => this.addQuotation()}
                        />
                    </PPContent>

                    <PPButton trigger={this.addQuotation}
                              disabled={validateLength(this.state.text, 5, 150)
                                  || validateLength(this.state.from, 5, 150)}
                              color="#fff" bgColor="var(--sys-blue)">Hinzufügen</PPButton>
                </Popup>
            </>
        );
    }
}

class ContainerQuotation extends React.Component {
    render() {
        let quotationElements = [];
        let id = 0;
        this.props.quotation.forEach(quotation => {
            quotationElements.push(<ContainerQuotationElement key={quotation.quotationId} quotation={quotation}
                                                                  delay={id++ * 0.1} />)
        })

        if (quotationElements.length === 0 && this.props.onlyLike && this.props.search)
            return <>
                {this.props.addQuotation ?
                    <ContainerAddQuotation toggle={this.props.toggleAddQuotation}/>
                    : null}
                <ContainerInformationBanner
                    title={`Kein Zitat mit "${this.props.search}" gefunden, das dir gefällt`}
                    description={"Drücke auf das Herz, um nach Zitate zu suchen die dir nicht gefallen."}
                    icon={"heart-dislike-outline"}
                    color={"gray"}
                />
            </>

        if (quotationElements.length === 0 && this.props.search)
            return <>
                {this.props.addQuotation ?
                    <ContainerAddQuotation toggle={this.props.toggleAddQuotation}/>
                    : null}
                <ContainerInformationBanner
                    title={`Kein Zitat mit "${this.props.search}" gefunden`}
                    description={"Ändere deine Eingabe, um ein passendes Zitat zu finden."}
                    icon={"pencil-outline"}
                    color={"gray"}
                />
            </>

        if (quotationElements.length === 0)
            return <>
                {this.props.addQuotation ?
                    <ContainerAddQuotation toggle={this.props.toggleAddQuotation}/>
                    : null}
                <ContainerInformationBanner
                    title={`Keine Zitate gefunden`}
                    description={"Drücke auf das Plus, um ein neues Zitat hinzuzufügen."}
                    icon={"pencil-outline"}
                    color={"gray"}
                />
            </>

        return (
            <>
                {this.props.addQuotation ?
                    <ContainerAddQuotation toggle={this.props.toggleAddQuotation}/>
                    : null}
                {quotationElements}
            </>);
    }
}

class ContentQuotation extends React.Component {
    constructor(props) {
        super(props);

        this.interval = setInterval(() => {if (DHUpdated) { this.setState({age: this.state.age++}); DHUpdated = false}}, 100)
        this.state = {
            color: "#4bbef6",
            addQuotation: false,
            searchText: "",
            sorting: "date-descending",
            onlyLikes: false,
            age: 0
        }
    }
    componentWillUnmount() {clearInterval(this.interval)}

    toggleAddQuotation = () => this.setState({addQuotation: !this.state.addQuotation})

    updateOnlyLikes = () => this.setState({onlyLikes: !this.state.onlyLikes})

    updateSorting = (val) => this.setState({sorting: val})

    setSearchText = (val) => this.setState({searchText: val})

    render() {
        // filters for only likes or search Text and sorts with given parameter
        let quotation = getDH("quotations")
            .filter(quotation => {
                if (this.state.onlyLikes) {
                    return quotation.likes.find(like => like.studentId === getDH("identity").studentId) !== undefined
                }
                return true;})
            .filter(quotation => quotation.quote.text.toUpperCase().includes(this.state.searchText.toUpperCase())
                || quotation.quote.from.toUpperCase().includes(this.state.searchText.toUpperCase()))
            .sort((a, b) => {
                let aVal, bVal;
                switch (this.state.sorting) {
                    case "date-ascending":
                        aVal = new Date(b.quotePublish.date).getTime()
                        bVal = new Date(a.quotePublish.date).getTime()
                        break;

                    case "date-descending":
                        aVal = new Date(a.quotePublish.date).getTime()
                        bVal = new Date(b.quotePublish.date).getTime()
                        break;

                    case "like-ascending":
                        aVal = b.likes.length
                        bVal = a.likes.length
                        break;

                    case "like-descending":
                        aVal = a.likes.length
                        bVal = b.likes.length
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
                        {hasPermission(Permission.QUOTATION_CREATE) && (
                            <ABButton key="1" trigger={this.toggleAddQuotation} icon="add-outline" />
                        )}
                        <ABButton key="2"
                                  trigger={this.updateOnlyLikes}
                                  icon={this.state.onlyLikes ? "heart" : "heart-outline"} />
                        <ABSearchBar key="3" trigger={this.setSearchText} placeholder="Suchen" />
                    </ActionBar>

                    <Header title={`${this.state.searchText ? "Gefundene Zitate" : "Alle Zitate"} • ${getDH("quotations").length}`}
                            color={this.state.color} >
                        <HSorting trigger={this.updateSorting}
                                  default={this.state.sorting}
                                  options={{
                                      "date-ascending": '▲ Hinzugefügt',
                                      "date-descending": '▼ Hinzugefügt',
                                      "like-ascending": '▲ Likes',
                                      "like-descending": '▼ Likes'
                                  }}
                        />
                    </Header>
                </CHHeading>
                <CHBody>
                    <ContainerQuotation
                        quotation={quotation}
                        addQuotation={this.state.addQuotation}
                        toggleAddQuotation={this.toggleAddQuotation} />
                </CHBody>
            </ContentHolder>
        );
    }
}