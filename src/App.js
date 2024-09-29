import './App.css';
import React, {Component} from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider, connect } from 'react-redux';
import 'bootstrap-icons/font/bootstrap-icons.css';

//Redux
const defaultState = {
  break: 5,
  session: 25,
  sessionMode: true,
};

const INC_BREAK = "INC_BREAK";
const DEC_BREAK = "DEC_BREAK";
const INC_SESSION = "INC_SESSION";
const DEC_SESSION = "DEC_SESSION";
const CHANGE_MODE = "CHANGE_MODE";
const RESET = "RESET";

const reducer = (state = defaultState, action) => {
  switch(action.type){
    case INC_BREAK:
      return {
        ...state,
        break: state.break < 60 ? state.break + 1 : state.break};
    case DEC_BREAK:
      return {
        ...state,
        break: state.break > 1 ? state.break - 1 : state.break};
    case INC_SESSION:
      return {
        ...state,
        session: state.session < 60 ? state.session + 1 : state.session};
    case DEC_SESSION:
      return {
        ...state,
        session: state.session > 1 ? state.session - 1 : state.session};
    case CHANGE_MODE:
      return {
        ...state,
        sessionMode: !state.sessionMode};
    case RESET:
      return {
        ...defaultState};
    default:
      return state
  };
};

const store = configureStore({ reducer });

const incBreakAction = () => ({type: INC_BREAK});
const decBreakAction = () => ({type: DEC_BREAK});
const incSessionAction = () => ({type: INC_SESSION});
const decSessionAction = () => ({type: DEC_SESSION});
const changeModeAction = () => ({type: CHANGE_MODE});
const resetAction = () => ({type: RESET});


//React

class Break extends Component {
  constructor(props){
    super(props);
    this.incBreak = this.incBreak.bind(this);
    this.decBreak = this.decBreak.bind(this);
  };

  incBreak(){
    if (this.props.break < 60 ) {
    this.props.incBreakActionCall(); };
  };

  decBreak(){
    if (this.props.break > 1 ) {
    this.props.decBreakActionCall(); };
  };

  render() {    
    return(
      <div className='lenghts'>
        <h3 id='break-label'>Break Length</h3>
        <button id='break-decrement' onClick={this.decBreak}><i className='bi bi-chevron-down'></i></button>
        <span id='break-length'>{this.props.break}</span>
        <button id='break-increment' onClick={this.incBreak}><i className='bi bi-chevron-up'></i></button>
      </div>
    );
  };
};

class Session extends Component {
  constructor(props){
    super(props);
    this.incSession = this.incSession.bind(this);
    this.decSession = this.decSession.bind(this);
  };

  incSession(){
    if (this.props.session < 60 ) {
    this.props.incSessionActionCall();};
  };

  decSession(){
    if (this.props.session > 1 ) {
    this.props.decSessionActionCall();};
  };

  render() {    
    return(
      <div className='lenghts'>
        <h3 id='session-label'>Session Length</h3>
        <button id='session-decrement' onClick={this.decSession}><i className='bi bi-chevron-down'></i></button>
        <span id='session-length'>{this.props.session}</span>
        <button id='session-increment' onClick={this.incSession}><i className='bi bi-chevron-up'></i></button>
      </div>
    );
  };
};

class Timer extends Component {
  constructor(props){
    super(props);
    this.state = {
      mode: this.props.sessionMode ? "Session" : "Break",
      currentTime: `${this.props.session}:00`,
      timerInterval: null,
      timerIsRunning: false,
      count: 1
    };

    this.reset = this.reset.bind(this);
    this.startOrStop = this.startOrStop.bind(this);
    this.updateState = this.updateState.bind(this);
    this.switchMode = this.switchMode.bind(this);
    this.playAlarm = this.playAlarm.bind(this);
    this.runTimer = this.runTimer.bind(this);
   // this.disableButtons = this.disableButtons.bind(this);
  };

  componentDidMount() {
    this.unsubscribe = store.subscribe(this.updateState);
  }

  componentWillUnmount() {
    this.unsubscribe();
    clearInterval(this.state.timerInterval);
  }

  updateState() {
    const state = store.getState();
    const mode = state.sessionMode ? "Session" : "Break";
    const time = state.sessionMode ? state.session : state.break;
    const formattedTime = ('0' + time).slice(-2)
    this.setState({
      mode: mode,
      currentTime: `${formattedTime}:00`
    });
  } 

  reset(){
    clearInterval(this.state.timerInterval);
    this.props.resetActionCall();
    setTimeout(()=>{
    this.setState({
      mode: this.props.sessionMode ? "Session" : "Break",
      timerIsRunning: false,
      timerInterval: null,
      count: 1
    });}, 0)
    const audio = document.getElementById("beep");
    audio.currentTime = 0;
    audio.pause();
  };

  switchMode() {
    clearInterval(this.state.timerInterval);
    this.props.changeModeActionCall();  
    
    setTimeout(() => {
    const state = store.getState();
    const newMode = state.sessionMode ? "Session" : "Break";
    const time = state.sessionMode ? state.session : state.break;
    const formattedTime = ('0' + time).slice(-2);

    this.setState({
      mode: newMode,
      currentTime: `${formattedTime}:00`,
      count: 1,
    });

    this.runTimer();
  }, 0);
  };

  playAlarm(){
    const audio = document.getElementById("beep");
    audio.currentTime = 0;
    audio.play().catch((e)=> {
      console.log("Error playing audio: " + e);
    });
    setTimeout(() =>{
      audio.currentTime = 0;
      audio.pause();
    }, 3000)
  }


  runTimer() {
    if(this.state.timerInterval !== null) {
      clearInterval(this.state.timerInterval);
    }

    let [minutes, seconds] = this.state.currentTime.split(":").map(Number);
    let totMiliseconds = (minutes * 60 + seconds) * 1000;

    const timeInterval = setInterval(() => {
        let timeLeft = totMiliseconds - (1000 * this.state.count);
      if (timeLeft >= 0) {
        let newMinutes = Math.floor(timeLeft/(1000 *60));
        let formattedMinutes = ('0' + newMinutes).slice(-2);
        let newSeconds = Math.floor((timeLeft/1000) % 60);
        let formattedSeconds = ('0' + newSeconds).slice(-2);

        let text = `${formattedMinutes}:${formattedSeconds}`;

        this.setState((prevState)=>({
         currentTime: text,
         count: prevState.count +1,
        }));
      } else {
        this.playAlarm();
        clearInterval(this.state.timerInterval); 
        this.switchMode();
      }
    }, 1000);

    this.setState({
      timerInterval: timeInterval
    });
  };

  //disables Buttons, when the timer is running, not activated due to FCC test errors
  /*disableButtons(){
    if(!this.state.timerIsRunning){
      document.getElementById("break-decrement").disabled = true;
      document.getElementById("break-increment").disabled = true;
      document.getElementById("session-decrement").disabled = true;
      document.getElementById("session-increment").disabled = true;
    } else {
      document.getElementById("break-decrement").disabled = false;
      document.getElementById("break-increment").disabled = false;
      document.getElementById("session-decrement").disabled = false;
      document.getElementById("session-increment").disabled = false;
    }
  }*/

  startOrStop(){
   // this.disableButtons();
    if(!this.state.timerIsRunning){
      this.runTimer();
      this.setState({
        timerIsRunning: true,
        count: 1,
      });       
    } else {
      clearInterval(this.state.timerInterval);
      this.setState({
        timerIsRunning: false,
        timerInterval: null,
        count: 1,
      })
    }
  }

  render() {
    return(
      <div className='timer'>
        <h2 id='timer-label'>{this.state.mode}</h2>
        <div id="time-left">{this.state.currentTime}</div>
        <button id='start_stop' onClick={this.startOrStop}>{this.state.timerIsRunning ? (<i className='bi bi-pause-fill'></i>) : (<i className='bi bi-play-fill'></i>)}</button>
        <button id='reset' onClick={this.reset}><i className='bi bi-arrow-counterclockwise'></i></button>
        <audio id='beep' src='https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav' ></audio>
      </div>
    );
  };
};

//React Redux

const mapStateToProps = (state) => ({
  break: state.break,
  session: state.session,
  sessionMode: state.sessionMode,
});

const mapDispatchToProps = (dispatch) => {
  return {
    incBreakActionCall: function(){dispatch(incBreakAction())},
    decBreakActionCall: function(){dispatch(decBreakAction())},
    incSessionActionCall: function(){dispatch(incSessionAction())},
    decSessionActionCall: function(){dispatch(decSessionAction())},
    changeModeActionCall: function(){dispatch(changeModeAction())},
    resetActionCall: function(){dispatch(resetAction())},
  };
};

const ConnectedBreak = connect(mapStateToProps,mapDispatchToProps)(Break);
const ConnectedSession = connect(mapStateToProps,mapDispatchToProps)(Session);
const ConnectedTimer = connect(mapStateToProps,mapDispatchToProps)(Timer);

class App extends Component{
  render(){
    return (
      <Provider store={store}>
        <h1>25 - 5 CLOCK</h1>
        <div className='break-session-container'>
          <ConnectedBreak />
          <ConnectedSession />
        </div>
        <ConnectedTimer />
      </Provider>
    );
  };
};

export default App;