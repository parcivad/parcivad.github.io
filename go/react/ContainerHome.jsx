class ContainerHome extends React.Component {
    render() {
        return (
            <div>

            </div>
        );
    }
}

class ContentHome extends React.Component {
    constructor(props) {
        super(props);

        this.interval = setInterval(() => {if (DHUpdated) { this.setState({age: this.state.age++}); DHUpdated = false}}, 100)
        this.state = {age: 0}
    }
    componentWillUnmount() {clearInterval(this.interval)}


    render() {
        return (
            <ContentHolder>
                <CHHeading>
                    <ActionBar>
                        <ABButton key="1" trigger={() => {}} icon="add-outlin" />
                    </ActionBar>
                    <Header title={`Übersicht`}
                            color="var(--sys-gray)" >
                    </Header>
                </CHHeading>
                <CHBody>
                    <ContainerHome />
                </CHBody>
            </ContentHolder>
        );
    }
}