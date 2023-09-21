class ContainerAuditLogRecordsOverview extends React.Component {

    componentDidMount() {
        this.initEChart()
    }

    componentWillUpdate() {
        this.initEChart()
    }

    /**
     * Counts roles for given students to present data for echart
     * @returns {*[]}
     */
    studentData() {

        let count = {},
            data = [];

        this.props.auditLogs.forEach(auditLog => {
            if (!isset(count[auditLog.type])) count[auditLog.type] = 0
            count[auditLog.type]++
        })

        for (let countKey in count) {
            data.push({value: count[countKey], name: countKey})
        }

        return data;
    }

    /**
     * Loads data from props and provides go role overview
     * Call only after component build!
     */
    initEChart() {

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
                bottom: '0%',
                left: 'center',
                textStyle: {
                    color: textColor
                }
            },
            title: {
                text: this.props.auditLogs.length,
                top: '35%',
                left: '49.5%',
                textAlign: 'center',
                textStyle: {
                    color: textColor
                }
            },
            series: [
                {
                    name: 'Aufzeichnungstyp',
                    type: 'pie',
                    top: '-8%',
                    left: '-20%',
                    right: '-20%',
                    bottom: '14%',
                    radius: ['40%', '80%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: backgroundColor,
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        color: textColor
                    },
                    data: this.studentData()
                }
            ]
        };

        try {
            let myChart = echarts.init(document.getElementById('echartRecordsTyp'))
            myChart.setOption(option);

            window.addEventListener('resize', function() {
                myChart.resize();
            });

            window.matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change',() => this.initEChart());

        } catch (exception) {}
    }

    render() {
        return (
            <div className="col-12 col-xl-4 roundContainer">
                <div className="w-100 h-100 roundContainerInner">
                    <h5>Aufzeichnungen</h5>
                    <div id={"echartRecordsTyp"} style={{width: "100%", height: "270px"}} />
                </div>
            </div>
        );
    }
}

class ContainerAuditLogList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            limit: 50
        }
    }

    render() {
        let delayCounter = 0;

        return (
            <div className="col-12 col-xl-8 roundContainer">
                <div className="w-100 h-100 roundContainerInner">
                    <div className="d-flex justify-content-between">
                        <h5>Log</h5>
                        <div className="d-flex justify-content-center align-items-start">
                            <select className="limit-select" value={this.state.limit}
                                    onChange={e => {this.setState({limit: e.value})}} >
                                <option disabled={true}>Anzeigemenge</option>
                                <option value={50}>50 Einträge</option>
                                <option value={150}>150 Einträge</option>
                                <option value={250}>250 Einträge</option>
                                <option value={400}>400 Einträge</option>
                                <option value={999999999999}>Alle Einträge</option>
                            </select>
                            <ion-icon name="albums-outline" />
                        </div>
                    </div>
                    <div className="px-2" style={{width: "100%", height: "270px", overflowY: "scroll", overflowX: "hidden"}}>
                        {this.props.auditLogs.length !== 0 ?
                            this.props.auditLogs.sort((a, b) => {
                                let aDate = new Date(b.date).getTime(),
                                    bDate = new Date(a.date).getTime();

                                return aDate < bDate ? -1 : (aDate > bDate ? 1 : 0);
                            })
                                .slice(0, this.state.limit).map(auditLog => {
                                if (delayCounter < 4) delayCounter += 0.5;

                                return <Motion.motion.div
                                    key={Math.random()}
                                    initial={{opacity: 0, y: -30}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{
                                        delay: 0.1 * delayCounter
                                    }}
                                    className="auditLogList-item"
                                >
                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex">
                                            <ion-icon name={auditLog.icon} style={{color: `var(--sys-${auditLog.color}`, fontSize: "13pt"}}/>
                                            <h5 className="m-0 ms-2" style={{fontSize: "11pt"}}>{auditLog.title}</h5>
                                        </div>
                                        <p className="m-0" style={{fontSize: "10pt", color: "var(--sys-gray)"}}>
                                            {new Date(auditLog.date).toLocaleString()}
                                        </p>
                                    </div>
                                    <p className="m-0" style={{fontSize: "9pt", color: "var(--sys-gray)"}}>
                                        {auditLog.description}
                                    </p>
                                </Motion.motion.div>
                            })
                            :
                            <ContainerInformationBanner icon="search-outline"
                                                        title="Keine Aufzeichnungen"
                                                        description="Es konnten keine AuditLog Aufzeichnungen gefunden werden."
                                                        color="gray" />
                        }
                    </div>
                </div>
            </div>
        );
    }
}

class ContainerAuditLogRecordsTimeline extends React.Component {

    componentDidMount() {
        this.initEChart()
    }

    componentWillUpdate() {
        this.initEChart()
    }

    /**
     * Counts roles for given students to present data for echart
     * @returns {*[]}
     */
    auditLogData() {
        let dataCollection = {},
            dataSeries = [];

        this.props.auditLogs.sort((a, b) => {
            let aDate = new Date(a.date).getTime(),
                bDate = new Date(b.date).getTime();

            return aDate < bDate ? -1 : (aDate > bDate ? 1 : 0);
        }).forEach(auditLog => {
            let date = new Date(auditLog.date).toISOString().split("T")[0] + "T12:00:00.000Z"

            if (!dataCollection[auditLog.title]) dataCollection[auditLog.title] = {}
            if (!dataCollection[auditLog.title][date]) dataCollection[auditLog.title][date] = 0
            dataCollection[auditLog.title][date]++
        })

        for (let dataCollectionKey in dataCollection) {
            let data = [],
                lastDate = null;
            for (let dataCollectionElementKey in dataCollection[dataCollectionKey]) {
                let currentDate = new Date(dataCollectionElementKey);

                if (lastDate === null){
                    data.push([dataCollectionElementKey, dataCollection[dataCollectionKey][dataCollectionElementKey]])
                    lastDate = currentDate;
                    continue
                }

                lastDate = new Date(lastDate.getTime() + (24*60*60*1000))
                while (lastDate.getTime() < currentDate.getTime()) {
                    data.push([lastDate.toISOString().split("T")[0] + "T12:00:00.000Z", 0])
                    lastDate = new Date(lastDate.getTime() + (24*60*60*1000))
                }

                data.push([dataCollectionElementKey, dataCollection[dataCollectionKey][dataCollectionElementKey]])
                lastDate = currentDate;
            }

            dataSeries.push({
                name: dataCollectionKey,
                type: 'line',
                smooth: true,
                symbol: 'none',
                areaStyle: {opacity: 0.1},
                data: data
            })
        }

        return dataSeries;
    }

    /**
     * Loads data from props and provides go role overview
     * Call only after component build!
     */
    initEChart() {

        let backgroundColor = "#d8d8dc",
            textColor = "#000";

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            backgroundColor = "#2c2c2e";
            textColor = "#fff";
        }

        let option = {
            tooltip: {
                trigger: 'axis',
                confine: true,
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                top: "20px",
                bottom: "60px",
                left: "30px",
                right: "15px"
            },
            xAxis: {
                type: 'time',
                axisLine: { onZero: true },
                boundaryGap: false
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    lineStyle: {
                        color: backgroundColor
                    }
                }
            },
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 80,
                    end: 100,
                    xAxisIndex: [0, 1]
                },
                {
                    type: 'inside',
                    realtime: true,
                    start: 80,
                    end: 100,
                    xAxisIndex: [0, 1]
                }
            ],
            series: this.auditLogData()
        };

        try {
            let myChart = echarts.init(document.getElementById('echartRecordsActionsTimeline'))
            myChart.setOption(option);

            window.addEventListener('resize', function() {
                myChart.resize();
            });

            window.matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change',() => this.initEChart());

        } catch (exception) {}
    }

    render() {
        return (
            <div className="col-12 roundContainer">
                <div className="w-100 h-100 roundContainerInner">
                    <h5>Häufigkeit ausgeführter Aktionen</h5>
                    <div id={"echartRecordsActionsTimeline"} style={{width: "100%", height: "470px"}} />
                </div>
            </div>
        );
    }
}

class ContainerAuditLog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {deletionPopup: false}
    }

    deleteAuditLogs = async () => {
        api("/go/auditlog/delete", "POST", null)
            .then(value => this.setState({auditLogs: []}));
    }

    render() {
        if (this.props.auditLogs.length === 0) return <ContainerInformationBanner
            title={`Keine AuditLogs gefunden`}
            description={"Die verschiedenen Ansichten von diesem Reiter können erst nach eingetragenen Daten angezeigt werden."}
            icon={"pulse-outline"}
            color={"gray"}
        />

        return (
            <>
                {this.state.deletionPopup ?
                    <Popup toggle={() => this.setState({deletionPopup: false})}>
                        <PPContent>
                            <PPHeadingIcon icon={"trash-outline"} color={"var(--sys-red)"} />
                            <PPHeading>AuditLog Löschen</PPHeading>
                            <PPDescription>
                                Möchtest du wirklich alle Aufzeichnungen vom AuditLog endgültig löschen?
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
                            trigger={this.deleteAuditLogs}
                            color={"#fff"}
                            bgColor={"var(--sys-red)"}
                        >
                            Löschen
                        </PPButton>
                    </Popup>
                    : null
                }
                <div className="row row-cols-auto pb-3">
                    <ContainerAuditLogRecordsOverview auditLogs={this.props.auditLogs} />
                    <ContainerAuditLogList auditLogs={this.props.auditLogs} />
                    <ContainerAuditLogRecordsTimeline auditLogs={this.props.auditLogs} />
                </div>

                {hasPermission(Permission.AUDITLOG_DELETE) ?
                    <DangerZone>
                        <DZTitle>💣 Achtung explosiv</DZTitle>
                        <DZItems>
                            <DZItem title="AuditLog Dateien löschen"
                                    description="Lösche alle AuditLog Aufzeichnung endgültig!" buttonText="Löschen"
                                    trigger={() => this.setState({deletionPopup: !this.state.deletionPopup})} />
                        </DZItems>
                    </DangerZone>
                    : null
                }
            </>);
    }
}

class ContentAuditLog extends React.Component {
    constructor(props) {
        super(props);

        this.interval = setInterval(() => {if (DHUpdated) { this.setState({age: this.state.age++}); DHUpdated = false}}, 100)
        this.state = {
            color: "var(--sys-mint)",
            filter: "",
            age: 0
        }
    }
    componentWillUnmount() {clearInterval(this.interval)}

    setFilter = (val) => this.setState({filter: val})

    render() {
        let auditLogs = getDH("auditLogs").filter(auditLog =>
            auditLog.title.toUpperCase().includes(this.state.filter.toUpperCase())
            || auditLog.description.toUpperCase().includes(this.state.filter.toUpperCase()));

        return (
            <ContentHolder>
                <CHHeading>
                    <ActionBar>
                        <ABSearchBar key="0" placeholder="Filter" trigger={this.setFilter} />
                    </ActionBar>

                    <Header title={`${this.state.searchText ? "AuditLog gefiltert" : "AuditLog"}`}
                            color={this.state.color}>
                    </Header>
                </CHHeading>
                <CHBody>
                    {hasPermission(Permission.AUDITLOG_SHOW) ?
                        <ContainerAuditLog auditLogs={auditLogs} />
                        :
                        <ContainerInformationBanner
                        icon={"hand-left-outline"}
                        color={"red"}
                        title={"Zugriff verweigert"}
                        description={"Dir fehlt die Berechtigung um auf das AuditLog zuzugreifen."}
                        />
                    }
                </CHBody>
            </ContentHolder>
        );
    }
}