class ItemValidationIcon extends React.Component {
    render() {
        return (
            <div className="icon-button">
                <ion-icon id="iconValidate" className="icon-validate"
                          name={this.props.valid ? "checkmark-circle-outline" : "close-circle-outline"}
                          style={{color: this.props.valid ? "var(--sys-green)" : "var(--sys-red)"}}>

                </ion-icon>
            </div>
        );
    }
}

class ItemTextButton extends React.Component {
    render() {
        return (
            <a className="actionText" onClick={this.props.trigger}
               style={{fontWeight: this.props.weight, color: this.props.color}}>
                {this.props.text}
            </a>
        );
    }
}

class ItemSaveButton extends React.Component {
    render() {
        return (
            <div>
                <div className="icon-button" onClick={this.props.trigger}>
                    <Motion.motion.div
                        initial={{color: "var(--sys-gray)"}}
                        whileHover={{
                            scale: [1, 1.1, 1, 1.1],
                            color: "var(--sys-blue)",
                            transition: { duration: 0.4 },
                        }}
                    >
                        <ion-icon name={this.props.saved ? "bookmark" : "bookmark-outline"}
                                  style={{color: this.props.saved ?
                                          "var(--sys-blue)" : "currentColor"}} />
                    </Motion.motion.div>
                </div>
            </div>
        );
    }
}

class ItemLikeButton extends React.Component {
    render() {
        return (
            <div className={this.props.horizontal ? "d-flex align-items-center" : ""}>
                <div className={`icon-button ${this.props.horizontal ? "order-1" : ""}`} onClick={this.props.trigger}>
                    <Motion.motion.div
                        initial={{scale: 1, color: "var(--sys-gray)"}}
                        whileTap={{
                            scale: 1.3,
                            transition: { duration: 0.2 }
                        }}
                        whileHover={{
                            scale: [1, 1.1, 1, 1.1],
                            color: "var(--sys-red)",
                            transition: { duration: 0.4 },
                        }}
                    >
                        <ion-icon name={this.props.liked ? "heart" : "heart-outline"}
                                  style={{color: this.props.liked ?
                                          "var(--sys-red)" : "currentColor"}} />
                    </Motion.motion.div>
                </div>
                <div className="text-center">
                    <p className={`px-0 fw-bold ${this.props.horizontal ? "mb-0 order-0" : ""}`}
                       style={{fontSize: "10pt", marginTop: "-7px", marginBottom: "4px",
                        color: this.props.liked ? "var(--sys-red)" : "var(--sys-gray)"}}>
                        {this.props.count}
                    </p>
                </div>
            </div>
        );
    }
}

class ItemSwitch extends React.Component {
    render() {
        return (
            <label className="switch">
                <input type="checkbox" checked={this.props.checked} disabled={this.props.disabled}
                       onChange={this.props.trigger}/>
                <span className="slider round" />
            </label>
        );
    }
}

class ItemInput extends React.Component {
    render() {
        return (
            <input className="createInput mt-2" placeholder={this.props.placeholder} type="text" id={this.props.id}
                   onKeyDown={e => { if (e.keyCode === 13) this.props.onEnter()}}
                   onInput={event => {
                       let target = event.currentTarget;
                       this.props.onInput(target.value)
                       // validation
                       target.setCustomValidity(this.props.onValid(target.value))
                       target.reportValidity()
                       event.preventDefault()
                   }}/>
        );
    }
}

class ItemBandageCorner extends React.Component {
    render() {
        return (
            <Motion.motion.p
                className={"p-0 bandageCorner"}
                initial={{x: 200}}
                animate={{x: 0}}
                transition={{
                    duration: 1,
                    ease: [0.4, 0.6, 0.9, 1]
                }}
            >
                    <span className={`bandage fw-${this.props.weight}`}
                          style={{backgroundColor: this.props.color}}>
                        {this.props.text}
                    </span>
            </Motion.motion.p>
        );
    }
}

class ItemBandage extends React.Component {
    render() {
        return (
            <div>

            </div>
        );
    }
}

class ItemAvatar extends React.Component {
    /*https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png*/
    render() {
        return (
            <div style={{
                width: this.props.size,
                height: this.props.size,
                borderRadius: "100%",
                backgroundColor: "var(--sys-white)",
                backgroundImage: 'url("/go/img/download.jpg")',
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover"}} />
        );
    }
}

class ItemColorSelection extends React.Component {
    render() {
        return (
            <div className="d-flex">
                <input className="createInput m-0 p-0"
                       value={this.props.color === undefined ? "#000000" : this.props.color}
                       type="color" onChange={(e) => this.props.trigger(e.target.value)}
                       style={{width: "60px", height: "55px",
                           cursor: this.props.disabled ? "not-allowed" : "pointer"}}
                       disabled={this.props.disabled} />
                <div className="ps-1" style={{filter: this.props.disabled ? "grayscale(0.6)" : "",
                    cursor: this.props.disabled ? "not-allowed" : "pointer"}}>

                    <div className="d-flex" >
                        <div className="m-1" onClick={() => this.props.trigger("#ff6550")} style={{width: "20px", height: "20px", backgroundColor: "#ff6550", borderRadius: "4px"}} />
                        <div className="m-1" onClick={() => this.props.trigger("#ff744a")} style={{width: "20px", height: "20px", backgroundColor: "#ff744a", borderRadius: "4px"}} />
                        <div className="m-1" onClick={() => this.props.trigger("#ff8543")} style={{width: "20px", height: "20px", backgroundColor: "#ff8543", borderRadius: "4px"}} />
                        <div className="m-1" onClick={() => this.props.trigger("#ffa538")} style={{width: "20px", height: "20px", backgroundColor: "#ffa538", borderRadius: "4px"}} />
                        <div className="m-1" onClick={() => this.props.trigger("#ffd928")} style={{width: "20px", height: "20px", backgroundColor: "#ffd928", borderRadius: "4px"}} />
                        <div className="m-1" onClick={() => this.props.trigger("#e7ee12")} style={{width: "20px", height: "20px", backgroundColor: "#e7ee12", borderRadius: "4px"}} />
                        <div className="m-1" onClick={() => this.props.trigger("#85e510")} style={{width: "20px", height: "20px", backgroundColor: "#85e510", borderRadius: "4px"}} />
                        <div className="m-1" onClick={() => this.props.trigger("#0eda1f")} style={{width: "20px", height: "20px", backgroundColor: "#0eda1f", borderRadius: "4px"}} />

                    </div>
                    <div className="d-flex" >
                        <div className="m-1" onClick={() => this.props.trigger("#f600ff")} style={{width: "20px", height: "20px", backgroundColor: "#f600ff", borderRadius: "4px"}} />
                        <div className="m-1" onClick={() => this.props.trigger("#a84fff")} style={{width: "20px", height: "20px", backgroundColor: "#a84fff", borderRadius: "4px"}} />
                        <div className="m-1" onClick={() => this.props.trigger("#0066ff")} style={{width: "20px", height: "20px", backgroundColor: "#0066ff", borderRadius: "4px"}} />
                        <div className="m-1" onClick={() => this.props.trigger("#0084ff")} style={{width: "20px", height: "20px", backgroundColor: "#0084ff", borderRadius: "4px"}} />
                        <div className="m-1" onClick={() => this.props.trigger("#00b2ff")} style={{width: "20px", height: "20px", backgroundColor: "#00b2ff", borderRadius: "4px"}} />
                        <div className="m-1" onClick={() => this.props.trigger("#00eeff")} style={{width: "20px", height: "20px", backgroundColor: "#00eeff", borderRadius: "4px"}} />
                        <div className="m-1" onClick={() => this.props.trigger("#00ffd4")} style={{width: "20px", height: "20px", backgroundColor: "#00ffd4", borderRadius: "4px"}} />
                        <div className="m-1" onClick={() => this.props.trigger("#0eda85")} style={{width: "20px", height: "20px", backgroundColor: "#0eda85", borderRadius: "4px"}} />
                    </div>
                </div>
            </div>
        );
    }
}

class ItemMultiSelect extends React.Component {
    constructor() {
        super();

        this.state = {
            open: false,
            checked: []
        }
    }

    toggle(value) {
        let checked = this.state.checked;
        if (this.state.checked.find(f => f === value) !== undefined) checked = checked.filter(val => val !== value)
        else checked = checked.concat(value)

        this.props.callback(checked)
        this.setState({checked: checked})
    }

    render() {
        return (
            <div className="contentAuthInput form-control">
                <div className="d-flex align-items-center justify-content-between cursor-pointer"
                     onClick={() => this.setState({open: !this.state.open})}>
                    <p className="m-0" style={{color: "var(--sys-gray)"}}>{this.props.topic} {this.state.checked.length === 0 ? "wählen" : `• ${this.state.checked.length} gewählt`}</p>
                    <ion-icon name={this.state.open ? "chevron-up" : "chevron-down"}
                              style={{color: "var(--sys-gray)", fontSize: "12pt"}}/>
                </div>
                <Motion.AnimatePresence>
                    {this.state.open && (
                        <Motion.motion.div
                            style={{webKitMaskImage: "linear-gradient(180deg, var(--sys-gray6) 70%, transparent 100%)",
                                maskImage: "linear-gradient(180deg, var(--sys-gray6) 70%, transparent 100%)",
                                borderTop: "1px solid var(--sys-gray4)", maxHeight: 250}}
                            className="overflow-scroll mt-1"
                            initial={{opacity: 0, height: 0}}
                            animate={{opacity: 1, height: "auto"}}
                            exit={{opacity: 0, height: 0}}
                        >
                            {this.props.options.map(option => {
                                return <div className="d-flex align-items-center justify-content-between py-2" key={option.value}>
                                    <p className="m-0" style={{fontSize: "11pt", fontWeight: "550", color: "var(--sys-gray0)"}}>
                                        {option.name}
                                    </p>
                                    <ItemSwitch checked={this.state.checked.find(f => f === option.value) !== undefined}
                                                trigger={() => this.toggle(option.value)} />
                                </div>
                            })}
                        </Motion.motion.div>
                    )}
                </Motion.AnimatePresence>
            </div>
        );
    }
}