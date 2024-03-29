import 'animate.css';
import InputField from './source/input-field.js';
import GameField from './source/game-field.js';
import PopUp from './source/pop-up.js';
import MiscButtons from './source/misc-buttons.js';
import { getSaveState, setSaveState, dispatchEvent } from './source/utils.js';

const states = {
  inputs: 'disabled',
}

document.addEventListener('DOMContentLoaded', function() {
  const maxTurns = 12;
  const today = new Date().toISOString().slice(0, 10).replace(/-/g,'');
  const lastVisited = JSON.parse(getSaveState('lastVisited'));
  const lastSession = JSON.parse(getSaveState('lastSession'));
  const defaultState =  {
    currentTurn: 1,
    historyArray: [],
    resultsArray: [],
    slidePosition: -20
  }

  if (lastVisited) {
    if (lastVisited != today) {
      setSaveState('lastVisited', today);
      setSaveState('lastSession', defaultState);
      dispatchEvent('game:start');

      return;
    } else if (lastSession.historyArray.length != 0) {
      lastSession.resultsArray.forEach(result => {
        if (result.correct == 4) {
          dispatchEvent('game:win');
        } else if (lastSession.resultsArray.length >= maxTurns) {
          dispatchEvent('game:lose');
        } else {
          dispatchEvent('game:start');
        }
      });
    } else {
      setSaveState('lastVisited', today);
      setSaveState('lastSession', defaultState);

      dispatchEvent('game:start');
    }
  } else {
    setSaveState('lastVisited', today);
    setSaveState('lastSession', defaultState);

    dispatchEvent('game:start');
  }
});
