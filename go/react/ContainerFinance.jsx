class ContainerFinanceTransactionPopup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0.0,
            title: "",
            description: "",
            tag: "",
            happened: Date.now()
        }
    }

    addTransaction = async () => {
        if (!this.validated()) return;

        api(`/student/finance/create`, "POST", JSON.stringify({
            "money": Math.floor(this.state.value * 100),
            "title": this.state.title,
            "description": this.state.description,
            "tag": this.state.tag,
            "happened": this.state.happened
        }))
            .then(value => {
                this.props.toggle()
                modifyDataDH("finance", value.data)
            })
            .catch(error => {return error})
    }

    validated() {
        return validateNotBlank(this.state.value) === null &&
            validateText(this.state.title, 5, 150) === null &&
            validateText(this.state.description, 5, 150) === null &&
            validateText(this.state.tag, 1, 999) === null &&
            validateNotBlank(this.state.happened) === null;
    }

    render() {
        return (
            <>
                <Popup toggle={() => this.props.toggle()}>
                    <PPContent>
                        <PPHeadingIcon icon={"ticket-outline"} color={"#8AC6D0"}/>
                        <PPHeading>Transaktion erstellen</PPHeading>
                        <PPDescription>Erstelle eine Transaktion und füge sie dem Transaktionsverlauf hinzu.</PPDescription>
                        <PPInputText
                            placeholder="0 €"
                            onValid={v => validateLength(v, 1, 99999999999)}
                            onInput={v => this.setState({value: parseFloat(v.replaceAll(",", "."))})}
                            onEnter={() => $("#tc1").focus()}
                        />
                        <PPInputText
                            id="tc1"
                            placeholder="Titel"
                            onValid={v => validateLength(v, 5, 150)}
                            onInput={v => this.setState({title: v})}
                            onEnter={() => $("#tc2").focus()}
                        />
                        <PPInputText
                            id="tc2"
                            placeholder="Beschreibung"
                            onValid={v => validateLength(v, 5, 40)}
                            onInput={v => this.setState({description: v})}
                            onEnter={() => $("#tc3").focus()}
                        />
                        <PPInputText
                            id="tc3"
                            placeholder="Gruppe"
                            onValid={v => validateLength(v, 1, 999)}
                            onInput={v => this.setState({tag: v})}
                            onEnter={() => $("#pc2").focus()}
                        />
                        <div className="col-12 pt-2">
                            <label className="w-100 h-100">
                                <input id="createTransactionFokus4"
                                       className="createInput" value={this.state.happened} type="datetime-local"
                                       style={{whiteSpace: "nowrap"}}
                                       onKeyDown={e => { if (e.keyCode === 13) this.addTransaction() }}
                                       onInput={e => this.setState({happened: e.target.value})} />
                                {validateNotBlank(this.state.happened)}
                            </label>
                        </div>

                    </PPContent>

                    <PPButton trigger={this.addTransaction} disabled={!this.validated()}
                              color="#fff" bgColor="var(--sys-blue)">Erstellen</PPButton>
                </Popup>
            </>
        );
    }
}

class ContainerFinanceGoalPopup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {value: 0}
    }

    setGoal = async () => {
        if (!this.validated()) return;

        api(`/student/finance/goal/${Math.floor(this.state.value * 100)}`, "POST", null)
            .then(value => {
                modifyDataDH("finance", value.data)
                this.props.toggle()
            })
            .catch(error => {return error})
    }

    validated() {return validateNotBlank(this.state.value) === null}

    render() {
        return (
            <>
                <Popup toggle={() => this.props.toggle()}>
                    <PPContent>
                        <PPHeadingIcon icon={"flag-outline"} color={"var(--sys-gray)"}/>
                        <PPHeading>Ziel ändern</PPHeading>
                        <PPDescription>Gebe einen neuen Betrag für das Finanz-Ziel an.</PPDescription>
                        <PPInputText
                            placeholder="0 €"
                            onValid={v => validateLength(v, 1, 99999999999)}
                            onInput={v => this.setState({value: parseFloat(v.replaceAll(",", "."))})}
                            onEnter={this.setGoal}
                        />
                    </PPContent>

                    <PPButton trigger={this.setGoal} disabled={!this.validated()}
                              color="#fff" bgColor="var(--sys-blue)">Ändern</PPButton>
                </Popup>
            </>
        );
    }
}

class ContainerTransactionElement extends React.Component {
    constructor(props) {
        super(props);

        let publisher = getDH("students").find(student => student.studentId === props.transactions.studentId).name;
        this.state = {
            money: props.transactions.money,
            title: props.transactions.title,
            description: props.transactions.description,
            tag: props.transactions.tag,
            created: timeToString(new Date(props.transactions.created)),
            happened: timeToString(new Date(props.transactions.happened)),
            authorizedBy: `${publisher.firstname} ${publisher.lastname}`
        };
    }

    render()  {
        return (
            <Motion.motion.div
                initial={{ opacity: 0 , y: -30,}}
                animate={{ opacity: 1 , y: 0}}
                transition={{
                    duration: 1,
                    delay: this.props.delay,
                    ease: [0, 0.3, 0.6, 1.01]
                }}
                className={"pb-3"}
            >
                <div className="w-100 d-flex p-3" style={{border: "1px solid var(--sys-gray6)", borderRadius: "12px"}}>
                    <div>
                        <p style={{color: `var(--sys-${this.state.money >= 0 ? "green" : "red"})`, whiteSpace: "nowrap", fontSize: "12pt", minWidth: "110px"}}>
                            {this.state.money >= 0 ? "+" : ''}{currency.format(this.state.money / 100)}
                        </p>
                    </div>
                    <div className="w-100 row row-cols-2">
                        <div className="col-12 col-sm-8">
                            <h6>{this.state.title}</h6>
                            <p>{this.state.description}</p>
                        </div>
                        <div className="col-12 col-sm-4 d-flex justify-content-sm-end">
                            <div>
                                <p className="pb-3 m-0"><span className="p-1"
                                                              style={{background: this.props.color,
                                                                  borderRadius: "8px", color: "#fff", opacity: "0.9"}}>{this.state.tag}</span></p>
                                <p className="m-0" style={{fontSize: "10pt", color: "var(--sys-gray)"}}>Erstellt: <span
                                    style={{fontSize: "11pt", color: "var(--sys-black)"}}>{this.state.created}</span>
                                </p>
                                <p className="m-0"
                                   style={{fontSize: "10pt", color: "var(--sys-gray)"}}>Stattgefunden: <span
                                    style={{fontSize: "11pt", color: "var(--sys-black)"}}>{this.state.happened}</span>
                                </p>
                                <p className="m-0"
                                   style={{fontSize: "10pt", color: "var(--sys-gray)"}}>Autorisiert: <span
                                    style={{fontSize: "11pt", color: "var(--sys-black)"}}>{this.state.authorizedBy}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </Motion.motion.div>
        );
    }
}

class ContainerFinanceWeekOverview extends React.Component {
    componentDidMount() {
        this.initEChart()
    }

    componentWillUpdate() {
        this.initEChart()
    }

    /**
     * Returns a set of data build out of transaction history given via props
     * @returns {{neg: *[], pos: *[], axis: *[]}}
     */
    buildGraphData() {
        let weeks = [],
            data = {"axis": [], "pos": [], "neg": []};

        for (let i=0; i < this.props.transactions.length; i++) {
            let transaction = this.props.transactions[i],
                money = transaction.money,
                happened = new Date(transaction.happened);

            let year = new Date(happened.getFullYear(), 0, 1);
            let days = Math.floor((happened - year) / (24 * 60 * 60 * 1000));
            let week = Math.ceil((happened.getDay() + 1 + days) / 7);
            if (isset(weeks[week])) {
                if (money >= 0) weeks[week]["pos"] += money;
                else weeks[week]["neg"] += money;
            } else {
                weeks[week] = {"pos": 0, "neg": 0};
                if (money >= 0) weeks[week]["pos"] = money;
                else weeks[week]["neg"] = money;
            }
        }

        data.axis = Object.keys(weeks)
        weeks.forEach(week => {
            data.pos.push(week.pos / 100)
            data.neg.push(week.neg / 100)
        })

        return data;
    }

    /**
     * Init echart for weekly overview with data out of buildGraphData function
     * Call only after component build!
     */
    initEChart() {

        let backgroundColor = "#d8d8dc";

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            backgroundColor = "#2c2c2e";
        }

        let grapData = this.buildGraphData();

        let option = {
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                top: '10%',
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: (function () {
                    let list = [];
                    grapData.axis.forEach(axis => list.push(`KW ${axis}`))
                    return list;
                })()
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    lineStyle: {
                        color: backgroundColor
                    }
                }
            },
            series: [
                {
                    name: 'Einnahmen',
                    type: 'bar',
                    stack: 'Total',
                    label: {
                        show: false
                    },
                    itemStyle: {
                        color: "#34c759",
                        borderRadius: [8, 8, 0, 0]
                    },
                    data: grapData.pos
                },
                {
                    name: 'Ausgaben',
                    type: 'bar',
                    stack: 'Total',
                    label: {
                        show: false
                    },
                    itemStyle: {
                        color: "#ff3b30",
                        borderRadius: [0, 0, 8, 8]
                    },
                    data: grapData.neg
                }
            ]
        };

        try {
            let myChart = echarts.init(document.getElementById('echartWeekOverview'))
            myChart.setOption(option);


            window.addEventListener('resize', function() {
                myChart.resize();
            });

            window.matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change',() => this.initEChart());
        } catch (exception) {
            console.error(exception)
        }
    }

    render() {
        return (
            <div className="order-0 order-sm-1 col-12 col-sm-8 pt-3 pt-sm-0" style={{height: "250px"}}>
                <div className="p-3"
                     style={{
                         height: "250px",
                         borderRadius: "10px",
                         backgroundColor: "var(--sys-gray6)"
                     }}>
                    <h5>Wochenübersicht</h5>
                    <div id="echartWeekOverview" style={{width: "100%", height: "90%"}} />
                </div>
            </div>
        );
    }
}

class ContainerFinanceIncome extends React.Component {
    componentDidMount() {
        this.initEChart()
    }

    componentWillUpdate() {
        this.initEChart()
    }

    /**
     * Init echart for income overview from tags via props
     * Call only after component build!
     */
    initEChart() {

        let backgroundColor = "#f2f2f7";

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            backgroundColor = "#1c1c1c";
        }

        let data = [];
        for (let tagsKey in this.props.tags) {
            data.push({value: this.props.tags[tagsKey] / 100, name: tagsKey})
        }

        let color = this.props.colorPallet;

        let option = {
            tooltip: {
                trigger: 'item',
                formatter: '<strong>{b0}:</strong>  {c0} €'
            },
            backgroundColor: backgroundColor,
            series: [
                {
                    type: 'pie',
                    top: '-8%',
                    left: '-20%',
                    right: '-20%',
                    bottom: '-8%',
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 8,
                        borderColor: backgroundColor,
                        borderWidth: 2
                    },
                    color: color,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    data: data
                }
            ]
        };

        try {
            let myChart = echarts.init(document.getElementById('echartIncome'))
            myChart.setOption(option);


            window.addEventListener('resize', function() {
                myChart.resize();
            });

            window.matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change',() => this.initEChart());
        } catch (exception) {
            console.error(exception)
        }
    }

    render() {
        return (
            <div className="order-1 order-sm-0 col-12 col-sm-4 pt-4 pt-sm-0 p-sm-0" style={{height: "250px"}}>
                <div className="p-3 division-container"
                     style={{
                         height: "250px",
                         borderRadius: "10px",
                         backgroundColor: "var(--sys-gray6)"
                     }}>
                    <h5>Einnahmen</h5>
                    <div id="echartIncome" style={{width: "100%", height: "90%"}} />
                </div>
            </div>
        );
    }
}

class ContainerFinanceGoal extends React.Component {
    render() {
        let moneyNeeded = this.props.goalMoney - this.props.totalMoney;

        return (
            <div className="ps-0 ps-xxl-3">
                <div className="p-3"
                     style={{borderRadius: "10px", backgroundColor: "var(--sys-gray6)"}}>
                    <h5>Ziel</h5>
                    <div className="d-flex justify-content-between w-100">
                        <div style={{fontSize: "11pt", color: "var(--sys-gray)"}}>
                            {moneyNeeded <= 0 ? "Erreicht!" : `noch ${currency.format(moneyNeeded / 100)}`}
                        </div>
                        <div>
                            <strong>{currency.format(this.props.goalMoney / 100)}</strong>
                        </div>
                    </div>
                    <div style={{width: "100%", height: "15px", lineHeight: "18px", fontSize: "22pt", textAlign: "end", border: "1px solid var(--sys-gray5)", background: "linear-gradient(to left, rgba(255, 255, 255, 0) "+ Math.round(100 - (this.props.totalMoney / this.props.goalMoney) * 100) +"%, #7f7fd5, #86a8e7, #91eae4)", borderRadius: "12px"}}>
                        🚀
                    </div>
                </div>
            </div>
        );
    }
}

class ContainerFinance extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: false,
            transactions: [],

            colorPallet: ["#af52de","#5856d6","#007aff","#32ade6","#30b0c7","#00c7be","#34c759","#ffcc00","#ff9500","#ff3b30", "#219ebc", "#ffb703", "#606c38"],
            tags: {},
            totalMoney: 0,
            goalMoney: 0
        }
    }

    componentDidMount() {
        this.prepareTransactions()
    }

    componentWillReceiveProps() {
        this.prepareTransactions()
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return {error: true};
    }

    prepareTransactions() {
        let transactions = this.props.transactions,
            totalMoney = 0,
            tags = {},
            tagsSorted = {};

        transactions.forEach(transaction => {
            // money handling
            totalMoney += transaction.money

            // tag handling
            if (!isset(tags[transaction.tag])) tags[transaction.tag] = 0
            tags[transaction.tag] += transaction.money;
        })

        let sortedTags = [];
        for (let key in tags) sortedTags.push([key, tags[key]]);

        sortedTags.sort(function(a, b) {
            a = a[1];
            b = b[1];

            return a > b ? -1 : (a < b ? 1 : 0);
        });

        for (let i = 0; i < sortedTags.length; i++) {
            let key = sortedTags[i][0],
                value = sortedTags[i][1];
            tagsSorted[key] = value;
        }

        this.setState({
            suspended: false,
            transactions: transactions,
            tags: tagsSorted,
            totalMoney: totalMoney,
            goalMoney: this.props.finance.goal
        })
    }

    prepareValue() {
        return this.state.transactions.sort((a, b) => {
            let aVal, bVal;

            switch (this.props.sort) {
                case "date-ascending":
                    aVal = new Date(b.happened).getTime()
                    bVal = new Date(a.happened).getTime()
                    break;

                case "date-descending":
                    aVal = new Date(a.happened).getTime()
                    bVal = new Date(b.happened).getTime()
                    break;

                case "money-ascending":
                    aVal = b.money
                    bVal = a.money
                    break;

                case "money-descending":
                    aVal = a.money
                    bVal = b.money
                    break;

                default:
                    return 0;
            }

            return aVal > bVal ? -1 : (aVal < bVal ? 1 : 0);
        });
    }

    render() {
        if (this.state.error) return <ContainerLoader height="100%" message="Etwas ist schiefgelaufen" />
        if (this.state.suspended) return <ContainerLoader height="100%" message="" />

        let transactionElements = [];
        let id = 0;
        this.prepareValue().forEach(
            transaction => {
                let colorIndex = 0;
                for (let tagsKey in this.state.tags) {
                    if (tagsKey === transaction.tag) break;
                    colorIndex++;
                }

                transactionElements.push(
                    <ContainerTransactionElement
                        key={transaction.created}
                        transactions={transaction}
                        color={this.state.colorPallet[colorIndex]}
                        delay={id++ * 0.1}
                    />)
            })


        if (transactionElements.length === 0 && this.props.search)
            return <>
                {this.props.transactionPopup ?
                    <ContainerFinanceTransactionPopup toggle={this.props.toggleTransactionPopup}/>
                    : null}
                {this.props.goalPopup ?
                    <ContainerFinanceGoalPopup toggle={this.props.toggleGoalPopup}/>
                    : null}
                <ContainerInformationBanner
                    title={`Keine Transaktion mit "${this.props.search}" gefunden`}
                    description={"Ändere deine Eingabe, um eine passende Transaktion zu finden."}
                    icon={"ticket-outline"}
                    color={"gray"}
                />
            </>

        if (transactionElements.length === 0)
            return <>
                {this.props.transactionPopup ?
                    <ContainerFinanceTransactionPopup toggle={this.props.toggleTransactionPopup}/>
                    : null}
                {this.props.goalPopup ?
                    <ContainerFinanceGoalPopup toggle={this.props.toggleGoalPopup}/>
                    : null}
                <ContainerInformationBanner
                    title={`Keine Transaktionen gefunden`}
                    description={"Für eine Finanzübersicht müssen Transaktionen angelegt werden. Drücke auf das Ticket, um eine neue Transaktion anzulegen"}
                    icon={"ticket-outline"}
                    color={"gray"}
                />
            </>

        return (
            <>
                {this.props.transactionPopup ?
                    <ContainerFinanceTransactionPopup toggle={this.props.toggleTransactionPopup}/>
                    : null}
                {this.props.goalPopup ?
                    <ContainerFinanceGoalPopup toggle={this.props.toggleGoalPopup}/>
                    : null}
                <div className="row">
                    <div className="col-12 col-xxl-5 p-sm-0 pe-md-3">
                        <div className="row h-100">
                            <div className="col-12 col-xxl-6">
                                <div className="d-flex align-content-center justify-content-end">
                                    <Motion.motion.div
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        transition={{duration: 0.5}}
                                    >
                                        <h2 className="m-0"
                                            style={{whiteSpace: "nowrap", fontSize: "30pt", fontWeight: "600"}}>
                                            {currency.format(this.state.totalMoney / 100)}
                                        </h2>
                                        <p className="text-end text-secondary">Insgesamt</p>
                                    </Motion.motion.div>
                                </div>
                            </div>
                            <div className="col-12 col-xxl-6">
                                <ContainerFinanceGoal goalMoney={this.state.goalMoney}
                                                      totalMoney={this.state.totalMoney} />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-xxl-7 pt-sm-3 pt-xxl-0 pb-3 pb-xxl-0">
                        <div className="row">
                            <ContainerFinanceIncome tags={this.state.tags} colorPallet={this.state.colorPallet}/>
                            <ContainerFinanceWeekOverview transactions={this.state.transactions}/>
                        </div>
                    </div>
                    <div className="col-12 transaction-container">
                        <h5>Transaktionen</h5>
                        <div className="pt-2 pb-5">
                            {transactionElements}
                        </div>
                    </div>
                </div>
            </>);
    }
}

class ContentFinance extends React.Component {
    constructor(props) {
        super(props);

        this.interval = setInterval(() => {if (DHUpdated) { this.setState({age: this.state.age++}); DHUpdated = false}}, 100)
        this.state = {
            title: "Finanzen",
            color: "var(--sys-green)",
            transactionPopup: false,
            goalPopup: false,
            searchText: "",
            sort: "date-descending",
            age: 0
        }
    }
    componentWillUnmount() {clearInterval(this.interval)}

    toggleTransactionPopup = () => this.setState({transactionPopup: !this.state.transactionPopup, goalPopup: false})

    toggleGoalPopup = () => this.setState({goalPopup: !this.state.goalPopup, transactionPopup: false})

    updateSorting = (val) => this.setState({sort: val})

    setSearchText = (val) => this.setState({title: val ? "Gefundene Transaktionen" : "Finanzen", searchText: val})

    render() {
        let transactions = getDH("finance").transactions.filter(transaction => {
            if (this.state.searchText === "") return true;
            return transaction.title.toUpperCase().includes(this.state.searchText.toUpperCase()) ||
                transaction.description.toUpperCase().includes(this.state.searchText.toUpperCase()) ||
                transaction.tag.toUpperCase().includes(this.state.searchText.toUpperCase());
        })

        return (
            <ContentHolder>
                <CHHeading>
                    <ActionBar>
                        {hasPermission(Permission.FINANCE_CREATE_TRANSACTION) ?
                            <ABButton key="1" trigger={this.toggleTransactionPopup} icon="ticket-outline" />
                            : null}
                        {hasPermission(Permission.FINANCE_SET_GOAL) ?
                            <ABButton key="2" trigger={this.toggleGoalPopup} icon="flag-outline" />
                            : null}
                        <ABSearchBar key="3" trigger={this.setSearchText} placeholder="Suchen" />
                    </ActionBar>

                    <Header title={this.state.title} color={this.state.color} >
                        <HSorting trigger={this.updateSorting}
                                  default={this.state.sort}
                                  options={{
                                      "date-ascending": '▲ Hinzugefügt',
                                      "date-descending": '▼ Hinzugefügt',
                                      "money-ascending": '▲ Betrag',
                                      "money-descending": '▼ Betrag'
                                  }}
                        />
                    </Header>
                </CHHeading>
                <CHBody>
                    {hasPermission(Permission.FINANCE_ACCESS) ?
                        <ContainerFinance
                            transactions={transactions}
                            finance={getDH("finance")}
                            transactionPopup={this.state.transactionPopup}
                            toggleTransactionPopup={this.toggleTransactionPopup}
                            goalPopup={this.state.goalPopup}
                            toggleGoalPopup={this.toggleGoalPopup}
                            search={this.state.searchText}
                            sort={this.state.sort}
                        />
                        :
                        <ContainerInformationBanner
                            icon={"hand-left-outline"}
                            color={"red"}
                            title={"Zugriff verweigert"}
                            description={"Dir fehlt die Berechtigung um auf Finanz-Daten zuzugreifen."}
                        />}
                </CHBody>
            </ContentHolder>
        );
    }
}