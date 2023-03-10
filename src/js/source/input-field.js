/*============================================================================
  InputField
==============================================================================*/

import { dispatchEvent } from './utils.js';

class InputField extends HTMLElement {
  constructor() {
    super();
    this.buttons = this.querySelectorAll('button');
    this.inputs = this.querySelectorAll('[data-input]');
    this.reset = this.querySelector('[data-reset]');
    this.submit = this.querySelector('[data-submit]');


    this.inputs.forEach(input => {
      const inputValue = input.dataset.input;
      this.inputClicked(inputValue);
      input.addEventListener('click', () => {
        this.inputClicked(inputValue);
      });
    });

    this.reset.addEventListener('click', () => {
      dispatchEvent('reset:clicked');
    });

    this.submit.addEventListener('click', () => {
      dispatchEvent('submit:clicked');
    });

    //set up click event for key 1-6
    window.addEventListener('keydown', e => {
      // 1 thru 6
      if (e.key >= 1 && e.key <= 6) {
        this.inputClicked(e.key);
      }

      // Submit
      if (e.key === 'Enter') {
        dispatchEvent('submit:clicked');
      }

      // Reset
      if (e.key === 'Backspace') {
        dispatchEvent('reset:clicked');
      }
    });

    //listen for inputs:disable event
    window.addEventListener('inputs:disable', () => {
      this.disableInputs();
    });

    //listen for inputs:enable event
    window.addEventListener('inputs:enable', () => {
      this.enableInputs();
    });
  }

  inputClicked(value) {
    dispatchEvent('input:clicked', value);
  }

  disableInputs() {
    this.buttons.forEach(input => {
      // set disabled attribute
      input.setAttribute('disabled', true);
    });
  }

  enableInputs() {
    this.buttons.forEach(input => {
      // remove disabled attribute
      input.removeAttribute('disabled');
    });
  }
}

customElements.define('input-field', InputField);
