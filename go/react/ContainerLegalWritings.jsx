class ContentLegalWritings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "Rechtsschriften",
            color: "var(--sys-gray)"
        }
    }

    render() {
        return (
            <ContentHolder>
                <CHHeading>
                    <ActionBar>
                         <ABButton trigger={() => {}} key="0" icon={"information-outline"} />
                    </ActionBar>

                    <Header title={this.state.title} color={this.state.color} />
                </CHHeading>
                <CHBody>
                    <div className="row g-2">
                        <div className="col-12 roundContainer">
                            <div className="roundContainerInner">
                                Datenschutzbedingungen
                                <p style={{fontSize: "10pt", color: "var(--sys-gray)"}}>
                                    Datenschutzbedingungen für die Nutzung der Website parcivad.de
                                </p>
                                <div className="icon-button text-start" onClick={() => location.assign("/datenschutz")}>
                                    <ion-icon style={{color: "var(--sys-black)"}}
                                              name="arrow-forward-outline" />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 roundContainer">
                            <div className="roundContainerInner">
                                Nutzungsbedingungen
                                <p style={{fontSize: "10pt", color: "var(--sys-gray)"}}>
                                    Nutzungsbedingungen für die Nutzung vom Classync Service angeboten über parcivad.de
                                    unter parcivad.de/student
                                </p>
                                <div className="icon-button text-start" onClick={() => location.assign("/nutzungsbedingungen")}>
                                    <ion-icon style={{color: "var(--sys-black)"}}
                                              name="arrow-forward-outline" />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 roundContainer">
                            <div className="roundContainerInner">
                                Impressum
                                <p style={{fontSize: "10pt", color: "var(--sys-gray)"}}>
                                    Impressum von Timur Stegmann haftend für die Website parcivad.de
                                </p>
                                <div className="icon-button text-start" onClick={() => location.assign("/impressum")}>
                                    <ion-icon style={{color: "var(--sys-black)"}}
                                              name="arrow-forward-outline" />
                                </div>
                            </div>
                        </div>
                    </div>
                </CHBody>
            </ContentHolder>
        );
    }
}