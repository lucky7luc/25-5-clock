import React, {Component} from 'react';
import Redux from 'redux';
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
      currentTime: 25,
      startStopBtn: false,
      resetBtn: false
    }
    this.reset = this.reset.bind(this);
  }

  reset(){
    this.props.resetActionCall();
  }
  
  render(){
    return (
      <div className="App">
       <span id="timer-label">Session</span>
       <div id="time-left">{this.props.currentTime}</div>
       <button id="start_stop">x</button>
       <button id="reset" onClick={this.reset}>o</button>
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
