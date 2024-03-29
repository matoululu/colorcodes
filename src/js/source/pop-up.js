/*============================================================================
  PopUp
==============================================================================*/

import { dispatchEvent, getSolution, getSaveState, logger } from './utils.js';

class PopUp extends HTMLElement {
  constructor() {
    super();
    this.play = this.querySelectorAll('[data-play]');
    this.refresh = this.querySelectorAll('[data-refresh]');
    this.popupScreen = this.querySelectorAll('.popup-screen');
    this.solutions = this.querySelectorAll('[data-solution]');
    this.shareBtns = this.querySelectorAll('[data-share]');
    this.tries = this.querySelector('[data-tries]');
    this.solutionArray = getSolution();

    this.play.forEach(button => {
      button.addEventListener('click', () => {
        logger('Play button clicked');
        dispatchEvent('inputs:enable');
        this.classList.add('hidden');
      });
    });

    window.addEventListener('game:start', () => {
      logger('Game has started');
      this.displayScreen('welcome');
    });

    window.addEventListener('game:win', () => {
      logger('Game has been won');
      dispatchEvent('inputs:disable');
      this.displayScreen('win');
    });

    window.addEventListener('game:lose', () => {
      logger('Game has been lost');
      dispatchEvent('inputs:disable');
      this.displayScreen('lose');
    });

    window.addEventListener('game:help', () => {
      logger('Help window opened');
      dispatchEvent('inputs:disable');
      this.displayScreen('help');
    });
  }

  displayScreen(context) {
    this.classList.remove('hidden');
    // Loop through popupScreen and set hidden class
    this.popupScreen.forEach(screen => {
      if (screen.dataset.context === context) {
        screen.classList.remove('hidden');
      } else {
        screen.classList.add('hidden');
      }
    });

    // Loop through solutions and add solution to screen
    if (context === 'win' || context === 'lose') {
      const session = JSON.parse(getSaveState('lastSession'));
      const turnCount = session.currentTurn;
      let turnText = 'turns';
      if (turnCount === 1) turnText = 'turn';
      let shareMsg;

      if (context === 'win') {
        shareMsg = `I cracked today's Colorcodes in ${turnCount} ${turnText}! Can you beat me?`;
      } else {
        shareMsg = `I couldn't crack today's Colorcodes! Can you?`;
      }

      const share = {
        title: 'Colorcodes',
        text: shareMsg,
        url: 'https://colorcodes.xyz/',
      };

      this.shareBtns.forEach(button => {
        button.addEventListener('click', () => {

          if (navigator.share) {
            navigator.share(share);
          } else {
            navigator.clipboard.writeText(`${share.text} | ${share.url}`);

            const spanText = button.querySelector('span');
            spanText.innerHTML = 'Copied!';
            setTimeout(() => {
              spanText.innerHTML = 'Share';
            }, 2000);
          }
        });
      });

      this.tries.innerHTML = `${turnCount} ${turnText}`;
      this.solutions.forEach(solutionEl => {
        solutionEl.innerHTML = '';

        this.solutionArray.forEach((input, i) => {
          const span = document.createElement('span');
          span.classList.add('input', `input-count--${i}`, `input--${input}`, 'animate__animated', 'animate__flipInX');
          solutionEl.appendChild(span);
        });
      });
    }
  }
}

customElements.define('pop-up', PopUp);
