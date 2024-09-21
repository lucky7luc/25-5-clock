import React, {Component} from 'react';
//import Redux from 'redux';
import {Provider, connect} from 'react-redux';
import './App.css';
import { configureStore } from '@reduxjs/toolkit';

// Redux
const DEC_BREAK = "DEC_BREAK";
const INC_BREAK = "INC_BREAK";
const DEC_SESSION = "DEC_SESSION";
const INC_SESSION = "INC_SESSION";
const RESET = "RESET";

const defaultState = {
  break: 5,
  session: 25
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
const resetAction = () => ({type: RESET});


// React
class Break extends Component{
  constructor(props){
    super(props);
    this.breakDecrement = this.breakDecrement.bind(this);
    this.breakIncrement = this.breakIncrement.bind(this);
  }

  breakDecrement(){
    this.props.decBreakActionCall();
  }

  breakIncrement(){
    this.props.incBreakActionCall();
  }

  render(){
    return (
      <div className="App">
       <span id="break-label">Break Length</span>
       <div id="break-length">{this.props.break}</div>
        <button id="break-decrement" onClick={this.breakDecrement}>-</button>
        <button id="break-increment" onClick={this.breakIncrement}>+</button>
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
    this.props.decSessionActionCall();
  }

  sessionIncrement(){
    this.props.incSessionActionCall();
  }

  render(){
    return (
      <div className="App">
       <span id="session-label">Session Length</span>
       <div id="session-length">{this.props.session}</div>
       <button id="session-decrement" onClick={this.sessionDecrement}>-</button>
       <button id="session-increment" onClick={this.sessionIncrement}>+</button>
      </div>
    );
  }
}

class Timer extends Component{
  constructor(props){
    super(props);
    this.state = {
      currentTime: '25 : 00',
      timerStarted: false,
      timerInterval: null
    }
    this.reset = this.reset.bind(this);
    this.startOrStopTimer = this.startOrStopTimer.bind(this);
  }

  reset(){
    this.props.resetActionCall();
    if(this.state.timerInterval){
      clearInterval(this.state.timerInterval)
    }
    this.setState({
      currentTime: '25 : 00',
      timerStarted: false,
      timerInterval: null
    });
  }

  startOrStopTimer(){
    let alarm = new Audio('alarm.mp3');

    if(!this.state.timerStarted){
      let startTime = new Date().getTime();
      let sessionTime = this.props.session * 1000 * 60;
      let endtime = startTime + sessionTime;

      const timerInterval = setInterval(() => {
        let timeLeft = endtime - new Date().getTime();

        if(timeLeft > 0){
          let minutes = Math.floor(timeLeft / (1000 * 60));
          let seconds = Math.round((timeLeft / 1000) % 60);
          seconds = ('0' + seconds).slice(-2);
          let text = ('0' + minutes).slice(-2) + ' : ' + seconds;

          this.setState({
            currentTime: text
          });
        } else {
          clearInterval(this.state.timerInterval);
          alarm.play();
          this.setState({
            currentTime: '00 : 00',
            timerStarted: false,
            timerInterval: null
          });
        }
      }, 1000);

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
      <div className="App">
       <span id="timer-label">Session</span>
       <div id="time-left">{this.state.currentTime}</div>
       <button id="start_stop" onClick={this.startOrStopTimer}>start/stop</button>
       <button id="reset" onClick={this.reset}>reset</button>
      </div>
    );
  }
}


// React-Redux
const mapStateToProps = (state) => {
  return {
    break: state.break,
    session: state.session
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    decBreakActionCall: function(){dispatch(decBreakAction())},
    incBreakActionCall: function(){dispatch(incBreakAction())},
    decSessionActionCall: function(){dispatch(decSessionAction())},
    incSessionActionCall: function(){dispatch(incSessionAction())},
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
