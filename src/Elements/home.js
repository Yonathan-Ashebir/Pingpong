import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Slider, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material"
import React from "react"
import { Navigate } from "react-router"
import { CSSTransition, SwitchTransition } from "react-transition-group"
import "../css/home.css"
import { gameTypes, getAllowed, getDifficulty, getGameDurationSeconds, getGameType, getTarget, getTargetLead, getTargetScore, setDifficulty, setGameType, setTargetScore } from "../management/data"
import { FadeCarousel } from "./fadeCarousel"
import { LinearRangeSelector } from "./linearRangeSelector"
export class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            gameType: getGameType(),
            difficulty: getDifficulty(),
            status: "opened", contactDialogOpened: false,
            countDialogOpened: false,
            gameTotalDurationSeconds: getGameDurationSeconds(),
            gameTargetScore: getTargetScore(),
            gameTargetLead: getTargetLead()
        };
    }
    render() {
        if (this.state.status === "entering game") {
            return <Navigate to="/game"></Navigate>
        }
        console.log("Home state:",this.state)
        return (
            <div id="home">
                <Stack spacing={3} alignItems="center" id="main">
                    <Button variant="text" onClick={() => { this.setState({ status: "entering game" }) }}>
                        <FadeCarousel random={false}>
                            <Stack spacing={3} alignItems="center" >
                                <div id="logo">
                                    <svg version="1.1" id="Capa_1" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 30.333 30.333" style={{ enableBackground: "new 0 0 30.333 30.333" }} space="preserve"> <g> <g> <g> <path d="M22.536,25.234c-0.742-0.429-1.586-0.914-2.424-1.699c-1.533-1.435-1.639-3.874-1.55-5.287h1.062 c0.59,0,0.994-0.598,0.773-1.146l-0.962-2.393h-2.969l-0.962,2.393c-0.221,0.55,0.184,1.146,0.775,1.146h0.772 c-0.097,1.699,0.081,4.559,2.03,6.383c0.965,0.902,1.888,1.435,2.699,1.903c1.432,0.827,2.221,1.282,2.4,3.122 c0.037,0.388,0.362,0.677,0.744,0.677c0.024,0,0.05-0.001,0.073-0.003c0.412-0.041,0.715-0.407,0.674-0.819 C25.425,26.902,24.022,26.092,22.536,25.234z" /> <path d="M12.914,21.889l-0.962-2.393H8.984l-0.963,2.393c-0.221,0.55,0.184,1.146,0.775,1.146h0.773 c-0.097,1.699,0.082,4.559,2.031,6.383c0.145,0.135,0.329,0.202,0.513,0.202c0.2,0,0.4-0.08,0.548-0.238 c0.283-0.302,0.267-0.775-0.035-1.06c-1.534-1.435-1.639-3.874-1.55-5.287h1.063C12.732,23.035,13.135,22.438,12.914,21.889z" /> <path d="M11.141,6.732c0-0.642,0.076-1.263,0.207-1.86c-0.288-0.051-0.58-0.085-0.88-0.085c-3.21,0-5.813,3.014-5.813,6.732 c0,3.718,2.603,6.731,5.813,6.731c2.427,0,4.504-1.725,5.375-4.171C13.116,13.068,11.141,10.159,11.141,6.732z M9.504,8.584 c-0.789,0-1.432,0.803-1.432,1.791c0,0.552-0.447,1-1,1s-1-0.448-1-1c0-2.09,1.539-3.791,3.432-3.791c0.553,0,1,0.448,1,1 C10.504,8.136,10.057,8.584,9.504,8.584z" /> <path d="M17.954,13.463c3.209,0,5.813-3.014,5.813-6.731C23.768,3.014,21.163,0,17.954,0c-3.21,0-5.813,3.014-5.813,6.732 C12.141,10.45,14.743,13.463,17.954,13.463z M17.447,1.405c0.554,0,1,0.448,1,1c0,0.552-0.446,1-1,1 c-0.789,0-1.433,0.803-1.433,1.791c0,0.552-0.446,1-1,1c-0.553,0-1-0.448-1-1C14.016,3.105,15.555,1.405,17.447,1.405z" /> </g> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg>

                                </div> 
                                <div id="phrase">A game for two.</div>
                            </Stack>
                            <Stack spacing={3} alignItems="center" >
                                <div id="logo">
                                    <svg version="1.1" x="0px" y="0px"
                                        viewBox="0 0 128 128" style={{ enableBackground: "new 0 0 128 128" }} space="preserve">
                                        <ellipse id="_x32_" transform="matrix(0.9063 -0.4226 0.4226 0.9063 -14.1315 39.0974)" cx="81.1" cy="51.4" rx="5.9" ry="5.9" />
                                        <path id="_x31__1_" d="M65.6,70.8H76l2.7-7.3c0.9-2.3,2.7-4.3,5.3-5.2l1-0.5c2.3-1.1,4.9-1,7-0.1l9.9,3.6c0.7,0.2,1.3,0.7,1.6,1.4
	l5.2,11c0.6,1.3,0.1,2.8-1.3,3.5c-1.3,0.6-2.8,0.1-3.5-1.3l-4.7-10.1l-5.8-2.1l13.5,28.9h12.5c2.1,0,3.7,1.6,3.7,3.7
	s-1.6,3.7-3.7,3.7h-14.8c-1.5,0-2.7-0.9-3.3-2.2l-4.7-10.1l-9.3,25.4c-0.7,1.9-2.8,2.9-4.7,2.2c-1.9-0.7-2.9-2.8-2.2-4.7l9.6-26.5
	l-7.4-15.9l-2.2,6c-0.4,1-1.3,1.7-2.4,1.7H65.6c-1.4,0-2.6-1.2-2.6-2.6C63,72,64.2,70.8,65.6,70.8z"/>
                                        <ellipse id="_x32__1_" transform="matrix(0.8192 -0.5736 0.5736 0.8192 -27.6599 24.4463)" cx="24.9" cy="56.1" rx="6.2" ry="6.2" />
                                        <path id="_x31__2_" d="M6.5,62.9c1.2-0.9,3-0.5,3.8,0.7l5.8,8.3l10-7l4-2.9c1.6-1.2,3.5-1.7,5.4-1.7h12.6c0.9-0.1,1.9,0.3,2.4,1.2
	l7.3,10.4c0.9,1.2,0.5,3-0.7,3.8s-3,0.5-3.8-0.7l-6.5-9.3h-7.6l19.6,28l12.3-3.3c2.1-0.5,4.2,0.7,4.7,2.7c0.5,2.1-0.7,4.2-2.7,4.7
	l-15,4c-0.9,0.2-2,0.2-3-0.4c-0.7-0.4-1.2-1.2-1.6-1.7c-0.4-0.5-6.8-9.7-6.8-9.7l-12.1,8.6l-2.4,13.8c-0.4,2.1-2.4,3.5-4.5,3.2
	c-2.1-0.4-3.5-2.4-3.2-4.5l2.7-15.3c0.2-1,0.8-1.9,1.6-2.5l9.6-6.7L27.4,70.5l-10.5,7.3c-1.2,0.9-3,0.5-3.8-0.7L5.8,66.6
	C4.9,65.4,5.2,63.7,6.5,62.9z"/>
                                    </svg>

                                </div>
                                <div id="phrase">Who is the best ?</div>
                            </Stack>
                            <Stack spacing={3} alignItems="center" >
                                <div id="logo">
                                    <svg version="1.1" x="0px" y="0px"
                                        width="100%" height="100%" viewBox="0 0 32 32" style={{ enableBackground: "new 0 0 32 32" }} space="preserve">
                                        <style type="text/css">
                                            {"feather_een{fill:#111918;}"}
                                        </style>
                                        <path className="feather_een" d="M9,2C7.346,2,6,3.346,6,5s1.346,3,3,3l1.001,0l0-6L9,2z M9,7C7.895,7,7,6.105,7,5c0-1.105,0.895-2,2-2
	V7z M11,24v3c0,0.552,0.448,1,1,1h8c0.552,0,1-0.448,1-1v-3c0-0.552-0.448-1-1-1h-8C11.448,23,11,23.448,11,24z M20,27h-8v-3h8V27z
	 M17,17c3.311,0,5.996-2.682,6-5.993L23.001,10c2.924,0,5.261-2.509,4.976-5.491C27.729,1.909,25.397,0,22.786,0H9.215
	C6.604,0,4.271,1.909,4.023,4.509C3.739,7.491,6.076,10,9,10l0.001,1.006c0.004,3.311,2.689,5.993,6,5.993h0.5v0H15.5v1.999H14
	c-0.552,0-1,0.448-1,1V21h-1c-1.657,0-3,1.343-3,3v5H8c-0.552,0-1,0.448-1,1v1c0,0.552,0.448,1,1,1h16c0.552,0,1-0.448,1-1v-1
	c0-0.552-0.448-1-1-1h-1v-5c0-1.657-1.343-3-3-3h-1v-1.001c0-0.552-0.448-1-1-1h-1.5v-2H17z M24,30v1H8v-1H24z M20,22
	c1.105,0,2,0.895,2,2v5H10v-5c0-1.105,0.895-2,2-2H20z M18,19.999v1H14v-1H18z M15.001,16c-2.757,0-5-2.243-5-5V9L8.949,9
	C6.766,8.972,5,7.189,5,5c0-2.206,1.794-4,4-4h14.001c2.206,0,4,1.794,4,4c0,2.189-1.766,3.972-3.949,4L22,9v2c0,2.757-2.243,5-5,5
	H15.001z M26.001,5c0-1.654-1.346-3-3-3L22,2l0,6l1.001,0C24.655,8,26.001,6.654,26.001,5z M23.001,3c1.105,0,2,0.895,2,2
	c0,1.105-0.895,2-2,2V3z"/>
                                    </svg>
                                </div>
                                <div id="phrase">Play Now !</div>
                            </Stack>
                        </FadeCarousel>
                    </Button>

                    <div id="prefs">
                        <Paper elevation={3} id="game-type-card">
                            <div id="game-type-selector">
                                <span id="game-type-label">Game Type:&nbsp;</span>
                                <ToggleButtonGroup exclusive style={{ transitionDuration: "400ms" }} value={this.state.gameType} onChange={((ev, gameType) => { if (gameType === undefined || gameType === null) return; setGameType(gameType); this.setState({ gameType: gameType }) }).bind(this)}>
                                    <ToggleButton className="game-type-option" value={gameTypes.SCORE}><span className="material-icons">leaderboard</span></ToggleButton>
                                    <ToggleButton style={{ transform: "rotateX(180deg)" }} className="game-type-option" value={gameTypes.LEAD_BY}><span className="material-icons">keyboard_option_key</span></ToggleButton>
                                    <ToggleButton className="game-type-option" value={gameTypes.TIME_OUT}><span className="material-icons">timer</span></ToggleButton>
                                </ToggleButtonGroup>
                            </div>
                            <div>
                                <span style={{ width: "100%", height: 1, display: "block", backgroundColor: "silver", marginTop: "2mm" }} />
                                <SwitchTransition mode="out-in">

                                    <CSSTransition key={this.state.gameType} classNames='details' addEndListener={(node, call) => { node.addEventListener("transitionend", (ev) => { if (ev.propertyName === "max-height") call(ev) }, false) }} >
                                        <div id="game-type-detail">
                                            <dt ><span className="game-detail-title">{["Score to win", "Always be a head", "Timer"][this.state.gameType]}</span>
                                            </dt>
                                            <dd className='game-detail-content'>
                                                {["Be the first to score ", "Beat up you opponent by ", "Retain your lead until all the "][this.state.gameType]} <span className={"count-note"} onClick={this.showCountSelector} className="count-selector">{
                                                    (this.state.gameType === gameTypes.SCORE) ? this.state.gameTargetScore : (this.state.gameType === gameTypes.LEAD_BY) ? this.state.gameTargetLead : this.state.gameTotalDurationSeconds
                                                } </span>{[" in order to win.", " point to win.", "ms are all up."][this.state.gameType]}
                                            </dd>
                                        </div>
                                    </CSSTransition>
                                </SwitchTransition>
                            </div>
                        </Paper>
                        <div height={30}></div>
                        <Paper elevation={3} id="difficulty-card" >
                            <span id="difficulty-label">Difficulty:&nbsp;</span>
                            <Slider
                                defaultValue={this.state.difficulty}
                                valueLabelDisplay="auto"
                                marks={true}
                                min={0}
                                max={5}
                                onChange={((ev, val) => { setDifficulty(val); this.setState({ difficulty: val }) }).bind(this)}
                            />
                        </Paper>

                    </div>
                </Stack>
                <Stack direction={"horizontal"} id="bottom-bar">
                    <span id="version">version 1.0.0</span>
                    <Button id="contact" onClick={this.showContactDialog}><span className="material-icons">contact_support</span>&nbsp;Contact ME</Button>
                </Stack>
                <div className="collapsed">
                    <Dialog open={this.state.countDialogOpened}>
                        <DialogTitle style={{ fontSize: "1em", color: "grey" }}>
                            {(this.state.gameType === gameTypes.SCORE) ? "Choose your target score" : (this.state.gameType === gameTypes.LEAD_BY) ? "Decide how far a head the winner should be" : "How long should the game be ?"}
                        </DialogTitle>
                        <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
                            <LinearRangeSelector values={getAllowed()} initial={getTarget()} onSelect={((ev, index) => {
                                this.setState({ countDialogOpened: false })
                                setTargetScore(getAllowed()[index])
                            }).bind(this)} />
                        </DialogContent>
                        <DialogActions>
                            <Button variant="text" color="primary" onClick={(() => { this.setState({ countDialogOpened: false }) }).bind(this)}>close</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={this.state.contactDialogOpened}>
                        <DialogTitle><span style={{ fontFamily: "Graduate" }}>Choose one</span></DialogTitle>
                        <DialogContent>
                            <ul className="contact-list">
                                <Button  color="primary" onClick={this.hideContactDialog} className="contact-option"variant="text"><a><span className="material-icons">mail</span>&nbsp;&nbsp;Contact via email</a> </Button>
                                <Button variant="text" color="primary" onClick={this.hideContactDialog} className="contact-option"><a><svg width="24px" height="24px" viewBox="0 0 24 24">
                                    <path d="M7,12 L14.5,12 C16.277025,12 17.7447372,10.6756742 17.970024,8.96013518 C16.2885152,8.7047201 15,7.25283448 15,5.5 C15,3.56700338 16.5670034,2 18.5,2 C20.4329966,2 22,3.56700338 22,5.5 C22,7.27155475 20.6838151,8.73569805 18.9759671,8.96790818 C18.7419236,11.2333126 16.8272778,13 14.5,13 L7,13 L7,15.0354444 C8.69614707,15.2780593 10,16.736764 10,18.5 C10,20.4329966 8.43299662,22 6.5,22 C4.56700338,22 3,20.4329966 3,18.5 C3,16.736764 4.30385293,15.2780593 6,15.0354444 L6,8.96455557 C4.30385293,8.72194074 3,7.26323595 3,5.5 C3,3.56700338 4.56700338,2 6.5,2 C8.43299662,2 10,3.56700338 10,5.5 C10,7.26323595 8.69614707,8.72194074 7,8.96455557 L7,12 Z M4,18.5 C4,19.8807119 5.11928813,21 6.5,21 C7.88071187,21 9,19.8807119 9,18.5 C9,17.1192881 7.88071187,16 6.5,16 C5.11928813,16 4,17.1192881 4,18.5 Z M4,5.5 C4,6.88071187 5.11928813,8 6.5,8 C7.88071187,8 9,6.88071187 9,5.5 C9,4.11928813 7.88071187,3 6.5,3 C5.11928813,3 4,4.11928813 4,5.5 Z M18.5,3 C17.1192881,3 16,4.11928813 16,5.5 C16,6.88071187 17.1192881,8 18.5,8 C19.8807119,8 21,6.88071187 21,5.5 C21,4.11928813 19.8807119,3 18.5,3 Z" />
                                </svg>&nbsp;&nbsp;Follow on github</a></Button>
                            </ul>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="text" color="primary" onClick={this.hideContactDialog}>close</Button>
                        </DialogActions>
                    </Dialog>
                </div>

            </div >
        )
    }
    showContactDialog = () => {
        this.setState({ contactDialogOpened: true })
    }
    showCountSelector = () => {
        this.setState({ countDialogOpened: true })
    }
    hideContactDialog = () => {
        this.setState({ contactDialogOpened: false })
    }
}