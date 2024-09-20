'use strict';
import { toggleVisibility } from './utils.js';

/**
 * Required HTML structure:
 * 1. A button to toggle the dropdown
 * 2. An element with the class 'dropdown' that will be toggled
 */

export default class AccordionComponent extends HTMLElement {
  constructor () {
    super();
    this.dropdown = this.querySelector('.dropdown');
    this.button = this.querySelector('button');
  }

  connectedCallback () {
    this.button.addEventListener('click', this.handleAction.bind(this));
    window.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  handleAction () {
    if (this.dropdown.classList.contains('open')) {
      this.closeAccordion();
    } else {
      this.openAccordion();
    }
  }

  openAccordion () {
    this.handleState('open');
    console.log('opening button: ', this.button);
    this.dropdown.style.height = this.dropdown.scrollHeight + 'px';
    this.button.setAttribute('aria-expanded', 'true');
  }

  closeAccordion () {
    this.handleState('close');
    this.dropdown.style.height = '0px';
    this.button.setAttribute('aria-expanded', 'false');
  }

  handleState (state, shouldPropagate = true) {
    toggleVisibility(this.dropdown, state);
    if (shouldPropagate) {
      this.propagateEvent(state);
    }
  }

  handleOutsideClick (event) {
    if (!this.contains(event.target)) {
      this.closeAccordion();
    }
  }

  propagateEvent (state) {
    this.dispatchEvent(new CustomEvent('accordion-action', { bubbles: true, detail: state }));
  }
}

customElements.define('accordion-component', AccordionComponent);
