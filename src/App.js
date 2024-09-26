import React, {Component} from 'react';
import {Provider, connect} from 'react-redux';
import './App.css';
import { configureStore } from '@reduxjs/toolkit';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';


// Redux
const DEC_BREAK = "DEC_BREAK";
const INC_BREAK = "INC_BREAK";
const DEC_SESSION = "DEC_SESSION";
const INC_SESSION = "INC_SESSION";
const CHANGE_MODE = "CHANGE_MODE";
const RESET = "RESET";

const defaultState = {
  break: 5,
  session: 25,
  sessionMode: true
};

const reducer = (state = defaultState, action) => {
  switch(action.type){
      case DEC_BREAK:
        return { 
          ...state,
          break: state.break - 1
        };
      case INC_BREAK:
        return { 
          ...state,
          break: state.break + 1
        };
      case DEC_SESSION:
        return { 
          ...state,
          session: state.session - 1
        };        
      case INC_SESSION:
          return { 
            ...state,
            session: state.session + 1
        };
      case CHANGE_MODE:
        return {
          ...state,
          sessionMode: !state.sessionMode
        };  
      case RESET:
        return {
          ...defaultState
        };
      default:
        return state
  };
}

const store = configureStore({ reducer });

const decBreakAction = () => ({type: DEC_BREAK});
const incBreakAction = () => ({type: INC_BREAK});
const decSessionAction = () => ({type: DEC_SESSION});
const incSessionAction = () => ({type: INC_SESSION});
const changeModeAction = () => ({type: CHANGE_MODE});
const resetAction = () => ({type: RESET});


// React
class Break extends Component{
  constructor(props){
    super(props);
    this.breakDecrement = this.breakDecrement.bind(this);
    this.breakIncrement = this.breakIncrement.bind(this);
  }

  breakDecrement(){
    if(this.props.break > 1){
    this.props.decBreakActionCall();
    }
  }

  breakIncrement(){
    if(this.props.break < 60){
    this.props.incBreakActionCall();
    }
  }

  render(){
    return (
      <div className="break-session-length">
        <div className="break-container">
       <span id="break-label">Break Length</span>
       <div id="break-length">{this.props.break}</div>
        <button id="break-decrement" onClick={this.breakDecrement}><i class="fas fa-chevron-down"></i>
</button>
        <button id="break-increment" onClick={this.breakIncrement}><i class="fas fa-chevron-up"></i>
</button>
        </div>
      </div>
    );
  }
}

class Session extends Component{
  constructor(props){
    super(props);
    this.sessionDecrement = this.sessionDecrement.bind(this);
    this.sessionIncrement = this.sessionIncrement.bind(this);
  }

  sessionDecrement(){
    if(this.props.session > 1){
    this.props.decSessionActionCall();
    }
  }

  sessionIncrement(){
    if(this.props.session < 60){
    this.props.incSessionActionCall();
    } 
  }

  render(){
    return (
      <div className="break-session-length">
        <div className="session-container">
       <span id="session-label">Session Length</span>
       <div id="session-length">{this.props.session}</div>
       <button id="session-decrement" onClick={this.sessionDecrement}><i class="fas fa-chevron-down"></i>
</button>
       <button id="session-increment" onClick={this.sessionIncrement}><i class="fas fa-chevron-up"></i>
</button>
       </div>
      </div>
    );
  }
}

class Timer extends Component{
  constructor(props){
    super(props);
    this.state = {
      currentTime: `${this.props.session} : 00`,
      timerStarted: false,
      timerInterval: null,
      mode: this.props.sessionMode ? "Session" : "Break",
    }
    this.reset = this.reset.bind(this);
    this.startOrStopTimer = this.startOrStopTimer.bind(this);
    this.updateState = this.updateState.bind(this);
    this.handleTimerEnd = this.handleTimerEnd.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(this.updateState);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  updateState() {
    const state = store.getState();
    const mode = state.sessionMode ? "Session" : "Break";
    const time = state.sessionMode ? state.session : state.break;
    this.setState({
      mode: mode,
      currentTime: `${time} : 00`
    });
  }

  reset(){
    this.props.resetActionCall();
    if(this.state.timerInterval){
      clearInterval(this.state.timerInterval)
    }
    this.setState({
      timerStarted: false,
      timerInterval: null,
      mode: "Session"
    });
  }

  handleTimerEnd(){
    //let alarm = new Audio('alarm.mp3');
    //alarm.play();
    console.log("helloo");

    clearInterval(this.state.timerInterval);
    this.setState({
      timerStarted: false,
      timerInterval: null,
    });

    if (this.props.sessionMode) {      
      this.props.changeModeActionCall();  // Wechsel zum Break-Modus
      this.setState({
        mode: "Break",
        currentTime: `${this.props.break} : 00`,
        timerStarted: false,
      });
      this.startOrStopTimer();  // Startet den Break-Timer
    } else {
      this.reset();  // Reset nach Beendigung des Breaks
      this.startOrStopTimer();
    }
  }

  startOrStopTimer(){

    if(!this.state.timerStarted){
      let startTime = new Date().getTime();
      let sessionTime = this.props.session * 1000 * 60;
      let endtime = startTime + sessionTime;

      const timerInterval = setInterval(() => {
        let timeLeft = endtime - new Date().getTime();

        console.log(timeLeft);

        if(timeLeft > 0){
          let minutes = Math.floor(timeLeft / (1000 * 60));
          let seconds = Math.round((timeLeft / 1000) % 60);
          let text = ('0' + minutes).slice(-2) + ' : ' + ('0' + seconds).slice(-2);

          this.setState({
            currentTime: text,
          });
        } 
      }, 1000);

      this.handleTimerEnd();

      this.setState({
        timerStarted: true,
        timerInterval: timerInterval
      });
    } else {
      clearInterval(this.state.timerInterval);
      this.setState({
        timerStarted: false,
        timerInterval: null
      });
    }

  }
  
  render(){
    return (
      <div className="timer">
       <span id="timer-label">{this.state.mode}</span>
       <div id="time-left">{this.state.currentTime}</div>
       <button id="start_stop" onClick={this.startOrStopTimer}><i class="bi bi-play-fill"></i>
/<i class="bi bi-stop-fill"></i>
</button>
       <button id="reset" onClick={this.reset}><i class="bi bi-arrow-clockwise"></i>
</button>
      </div>
    );
  }
}


// React-Redux
const mapStateToProps = (state) => {
  return {
    break: state.break,
    session: state.session,
    sessionMode: state.sessionMode
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    decBreakActionCall: function(){dispatch(decBreakAction())},
    incBreakActionCall: function(){dispatch(incBreakAction())},
    decSessionActionCall: function(){dispatch(decSessionAction())},
    incSessionActionCall: function(){dispatch(incSessionAction())},
    changeModeActionCall: function(){dispatch(changeModeAction())},
    resetActionCall: function(){dispatch(resetAction())}
    }
  }


const ConnectedBreak = connect(mapStateToProps, mapDispatchToProps)(Break);
const ConnectedSession = connect(mapStateToProps, mapDispatchToProps)(Session);
const ConnectedTimer = connect(mapStateToProps, mapDispatchToProps)(Timer);

class App extends Component{

  constructor(props){
    super(props);
  }

  render(){
  return (
    <Provider store={store}>
      <ConnectedBreak />
      <ConnectedSession />
      <ConnectedTimer />
    </Provider>
  );
  }
}

export default App;
