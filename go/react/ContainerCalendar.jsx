class ContainerCalendarSubstitution extends React.Component {

    replacementElement() {
        if (this.props.replacements.length !== 0) {
            return this.props.replacements
                .sort((a, b) => {return new Date(a.dtStart).getTime() - new Date(b.dtStart).getTime()})
                .map(replacements => {
                    let course = this.props.entries.find(entry => {
                            return (entry.course === replacements.course) && (entry.calendar.dtstart.split("T")[1] === replacements.dtStart.split("T")[1])
                        }),
                        startTime = new Date(course.startTimestamp * 1000);

                    return <div key={replacements.dtStart.toString() + replacements.location}
                                className="d-flex align-items-top justify-content-between roundContainerInner mb-2"
                                style={{backgroundColor: "var(--sys-gray5)"}}>
                        <div>
                            <p className="m-0 fw-bold">
                                {formatZeroToTime(startTime.getHours())}:{formatZeroToTime(startTime.getMinutes())}
                            </p>
                            <p className="m-0">{days[startTime.getDay()-1]}</p>
                        </div>
                        <div>
                            <h6 className="m-0">
                                {course.calendar.summary.replace("%s", replacements.summary)}
                            </h6>
                            <p className="m-0">
                                {course.calendar.description.replace("%s", replacements.description)}
                            </p>
                        </div>
                        <div className="d-flex flex-column align-items-center" style={{fontSize: "11pt"}}>
                            <ion-icon name="location-outline" />
                            <p className="m-0">{replacements.location}</p>
                        </div>
                        <div className="d-flex flex-column align-items-center justify-content-center">
                            <ion-icon name="ellipse" style={{color: replacements.cancelled ? "var(--sys-red)" : "var(--sys-orange)"}} />
                            <p className="m-0" style={{fontSize: "10pt", color: "var(--sys-gray)"}}>
                                {
                                    replacements.cancelled ?
                                        "Entfällt"
                                        :
                                        "Änderung"
                                }
                            </p>
                        </div>
                    </div>
                })
        }
        return <ContainerInformationBanner color="gray" icon="calendar-outline" title="Keine Vertretungen"
                                           description="Es konnten keine Vertretungen für deine Kurse gefunden werden."
        />
    }
    render() {
        return (
            <div className="roundContainerInner" style={{height: "65%"}}>
                <h5>Vertretungsplan</h5>
                <div className="pt-2 overflow-scroll h-100 pb-2">
                    {this.replacementElement()}
                </div>
            </div>
        );
    }
}

class ContainerCalendarWeek extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            weekDay: new Date().getDay()-1,
            entries: null
        }
    }

    componentDidMount() {
        let dayEntries = [[], [], [], [], []];
        this.props.entries.sort((a, b) => {return a["startTimestamp"] - b["startTimestamp"]}).forEach(entry => {
            dayEntries[new Date(entry["startTimestamp"] * 1000).getDay()-1].push(entry)
        })
        this.setState({entries: dayEntries})
    }

    renderDay() {
        return this.state.entries[this.state.weekDay].map(entry => {
            let startDate = new Date(entry.startTimestamp * 1000),
                endDate = new Date(entry.endTimestamp * 1000);

            return <div key={entry.startTimestamp} className="pt-2">
                <div className="roundContainerInner d-flex justify-content-between" style={{backgroundColor: "var(--sys-gray5)"}}>
                    <div className="d-flex">
                        <div>
                            <p className="m-0" style={{fontSize: "11pt", fontWeight: "550", color: "var(--sys-black)"}}>
                                {formatZeroToTime(startDate.getHours())}:{formatZeroToTime(startDate.getMinutes())}
                            </p>
                            <ion-icon style={{fontSize: "11pt"}} name="arrow-down-outline"></ion-icon>
                            <p className="m-0" style={{fontSize: "10pt", color: "var(--sys-gray)"}}>
                                {formatZeroToTime(endDate.getHours())}:{formatZeroToTime(endDate.getMinutes())}
                            </p>
                        </div>
                        <div className="ps-3">
                            <p className="m-0" style={{fontWeight: "bold"}}>{entry.calendar.summary}</p>
                            <p className="m-0" style={{fontSize: "11pt"}}>{entry.calendar.description}</p>
                        </div>
                    </div>
                    <div className="d-flex flex-column align-items-center" style={{fontSize: "10pt"}}>
                        <ion-icon name="location-outline" />
                        <p className="m-0">{entry.room}</p>
                    </div>
                </div>
            </div>
        })
    }

    render() {
        return (
            <div className="roundContainerInner h-100" style={{overflowY: "hidden"}}>
                <div className="d-flex justify-content-between">
                    <Motion.motion.div className="cursor-pointer"
                                       onClick={() => {
                                           if (this.state.weekDay !== 0) {
                                               this.setState({weekDay: (this.state.weekDay - 1)})
                                           } else {
                                               this.setState({weekDay: 4})
                                           }
                                       }}
                                       whileTap={{scale: 1.2}}>
                        <ion-icon name="arrow-back-circle-outline" />
                    </Motion.motion.div>
                    <h5 style={{color: this.state.weekDay === new Date().getDay()-1 ? "var(--sys-red)" : ""}}>
                        {this.state.weekDay === new Date().getDay()-1 ?
                            "Heute"
                            :
                            days[this.state.weekDay]
                        }
                    </h5>
                    <Motion.motion.div className="cursor-pointer"
                                       onClick={() => this.setState({weekDay: (this.state.weekDay + 1) % 5})}
                                       whileTap={{scale: 1.2}}>
                        <ion-icon name="arrow-forward-circle-outline" />
                    </Motion.motion.div>
                </div>
                <div style={{height: "95%", overflowY: "scroll", borderRadius: "0 0 8px 8px"}}>
                    {this.state.entries === null ?
                        <ContainerLoader height="100%" />
                        :
                        this.state.entries[this.state.weekDay] === undefined ?
                            <ContainerInformationBanner color="gray3" icon="calendar"
                                                        title="Keine Ereignisse"
                                                        description="Für diesen Tag liegen keine Ereignisse vor."/>
                            :
                            <>
                                {this.renderDay()}
                                <div className="d-flex align-items-center justify-content-center pt-4">
                                    <p style={{fontSize: "10pt", color: "gray"}}>Keine weiteren Ereignisse</p>
                                </div>
                            </>

                    }
                </div>
            </div>
        );
    }
}

class ContainerCalendarAbo extends React.Component {
    calendarURI = () => {
        // open calendar
        let ua = navigator.userAgent.toLowerCase();
        let isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
        if(isAndroid) {
            alert("google and outlook calendar not supported")
        } else {
            // open with apple calendar
            window.location.assign(`webcal://api.classync.de/ical?calendarId=${getDH("calendar").calendarId}`)
        }
    }

    render() {
        return (
            <div className="pt-2 pb-4 pb-sm-0" style={{height: "35%"}}>
                <div className="roundContainerInner h-100 d-flex flex-column justify-content-between"
                     style={{
                         background: "linear-gradient(to right bottom, #eea0a0, #ed9b9b, #ec9796, #ea9291, #e98d8c, #ec8f93, #ee919b, #f093a2, #f49eb7, #f6aaca, #f7b6dd, #f6c3ed)",
                         color: "var(--sys-white)"
                     }}>
                    <div className="overflow-scroll">
                        <div className="d-flex justify-content-between">
                            <h5>Abonnieren</h5>
                            <div className="cursor-pointer" onClick={this.calendarURI}>
                                <ion-icon style={{color: "var(--sys-white)", fontSize: "20pt"}} name="arrow-forward-outline" />
                            </div>
                        </div>
                        <p style={{fontSize: "10pt", color: "var(--sys-gray6)"}}>
                            Verbinde deinen Classync Kalender mit deiner Kalender-App. Für Vertretungs-,
                            Stunden- und Klausurplan in einer App.
                        </p>
                        <p style={{fontSize: "10pt", color: "var(--sys-gray6)"}}>
                            Nur  <strong>Apple</strong> Geräte aktualisieren deinen Kalender zuverlässig.
                        </p>
                    </div>
                    <div className="roundContainerInner d-flex justify-content-between" style={{backgroundColor: "var(--sys-white)", color: "var(--sys-black)"}}>
                        <p className="m-0" style={{fontSize: "11pt", color: "var(--sys-gray)"}}>
                            {getDH("calendar").calendarActive ?
                                <>Aktualisiert <strong>{timeToString(new Date(getDH("calendar").lastAccess))}</strong></>
                                :
                                "Kalender nicht abonniert"
                            }
                        </p>
                        <ion-icon name={
                            getDH("calendar").calendarActive ?
                                "checkmark-circle-outline"
                                :
                                "close-circle-outline"
                        } />
                    </div>
                </div>
            </div>
        );
    }
}

class ContainerCalendar extends React.Component {
    render() {
        return (
            <div className="row h-100">
                {this.props.entries !== undefined && this.props.replacements !== undefined ?
                    <>
                        <div className="col-12 col-md-5 roundContainer h-100">
                            <ContainerCalendarWeek entries={this.props.entries} />
                        </div>
                        <div className="col-12 col-md-7 roundContainer h-100">
                            <ContainerCalendarSubstitution entries={this.props.entries} replacements={this.props.replacements}/>
                            <ContainerCalendarAbo />
                        </div>
                    </>
                    :
                    <ContainerLoader height="100%" message="" />

                }
            </div>
    );
    }
}

class ContentCalendar extends React.Component {
    constructor(props) {
        super(props);

        this.interval = setInterval(() => {if (DHUpdated) this.setState({age: this.state.age++})}, 100)
        this.state = {
            title: "Kalender",
            color: "var(--sys-indigo)",
            searchText: "",
            age: 0
        }
    }
    componentWillUnmount() {clearInterval(this.interval)}

    render() {
        return (
            <ContentHolder>
                <CHHeading>
                    <ActionBar>
                        <ABButton key="1" icon="" trigger={() => {}} />
                    </ActionBar>

                    <Header title={this.state.title} color={this.state.color} />
                </CHHeading>
                <CHBody>
                    <ContainerCalendar entries={getDH("calendarEntries")} replacements={getDH("calendarReplacements")} />
                </CHBody>
            </ContentHolder>
        );
    }
}