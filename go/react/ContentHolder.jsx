class ContentHolder extends React.Component {

    scrollAdjustment = (event) => {
        if (window.innerWidth >= 719) return;

        let scroll = event.target.scrollTop,
            contentHeader = $(".contentHeader"),
            contentHeaderSorting = $(".contentHeaderSorting"),
            contentActionBar = $(".contentActionBar");


        if (scroll >= 120) {
            contentHeader.addClass("contentHeaderGone");
            contentHeaderSorting.addClass("contentHeaderSortingGone");
            contentActionBar.addClass("contentActionBarGone");
            return;
        }

        contentHeader.removeClass("contentHeaderGone");
        contentHeaderSorting.removeClass("contentHeaderSortingGone");
        contentActionBar.removeClass("contentActionBarGone");
    }


    render() {
        return (
            <div onScroll={event => this.scrollAdjustment(event)}
                 className="h-100" style={{overflowX: "hidden"}}>
                {this.props.children}
            </div>
        );
    }
}

class CHHeading extends React.Component {
    render() {
        return (
            <div className="col-12 pt-xl-3 sticky-top" style={{zIndex: "1", backgroundColor: "var(--bg-content)"}}>
                <div className="row justify-content-between mx-3">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

class CHBody extends React.Component {

    render() {
        return (
            <div className="pb-3 mx-4" style={{height: "90%"}}>
                {this.props.children}
            </div>
        );
    }
}