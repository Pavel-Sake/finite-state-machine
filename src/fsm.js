class Stack {
  constructor() {
    this.arr = [];
  }

  push(element) {
    this.arr.push(element);
  }

  pop() {
    if (this.arr.length) {
      const lastElement = this.arr[this.arr.length - 1];
      this.arr.splice(this.arr.length - 1, 1);
      return lastElement;
    } else {
      return null;
    }
  }

  getLastElement() {
    if (this.arr.length) {
      return this.arr[this.arr.length - 1];
    } else {
      return null;
    }
  }

  length() {
    return this.arr.length;
  }

  clean() {
    this.arr = [];
  }
}


class FSM {
  /**
   * Creates new FSM instance.
   * @param config
   */
  constructor(config) {
    if (!config) {
      throw new Error();
    }

    this.previousStateStack = new Stack();
    this.nextStateStack = new Stack();

    this.stateInitial = config.initial;
    this.currentState = config.initial;
    this.states = config.states;
  }

  /**
   * Returns active state.
   * @returns {String}
   */
  getState() {
    return this.currentState;
  }

  /**
   * Goes to specified state.
   * @param state
   */
  changeState(state) {
    if (!this.states[state]) {
      throw new Error();
    }
    if ((this.currentState !== state)) {
      this.previousStateStack.push(this.currentState);
      this.currentState = state;
      this.nextStateStack.clean();
    }
  }

  /**
   * Changes state according to event transition rules.
   * @param event
   */
  trigger(event) {
    for (let keyState in this.states) {
      if (keyState === this.currentState) {
        for (let keyTransition in this.states[keyState].transitions) {
          if (keyTransition === event) {
            const state = this.states[keyState].transitions[keyTransition];
            this.changeState(state);

            return;
          }
        }
      }
    }

    throw new Error();
  }

  /**
   * Resets FSM state to initial.
   */
  reset() {
    this.currentState = this.stateInitial;
  }

  /**
   * Returns an array of states for which there are specified event transition rules.
   * Returns all states if argument is undefined.
   * @param event
   * @returns {Array}
   */
  getStates(event) {
    const states = [];

    if (event) {
      for (let keySate in this.states) {
        for (let keyTransition in this.states[keySate].transitions) {
          if (keyTransition === event) {
            states.push(keySate);
          }
        }
      }
    } else {
      for (let keySate in this.states) {
        states.push(keySate);
      }
    }

    return states;
  }

  /**
   * Goes back to previous state.
   * Returns false if undo is not available.
   * @returns {Boolean}
   */
  undo() {
    if (!this.previousStateStack.length()) {
      return false;
    } else {
      if (this.nextStateStack.getLastElement() != this.currentState) {
        this.nextStateStack.push(this.currentState);
      }

      this.currentState = this.previousStateStack.pop();

      return true;
    }
  }

  /**
   * Goes redo to state.
   * Returns false if redo is not available.
   * @returns {Boolean}
   */
  redo() {
    if (!this.nextStateStack.length()) {
      return false;
    } else {
      this.previousStateStack.push(this.currentState);
      this.currentState = this.nextStateStack.pop();

      return true;
    }
  }

  /**
   * Clears transition history
   */
  clearHistory() {
    this.previousStateStack.clean();
    this.nextStateStack.clean();
    this.currentState = this.stateInitial;
  }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
