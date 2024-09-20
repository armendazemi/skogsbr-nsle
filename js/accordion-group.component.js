'use strict';
import { toggleVisibility } from './utils.js';

/**
 * Component used to control a group of accordion-components.
 *
 * At the moment the component is only responsible for making sure that there is only one
 * accordion-component open at a time.
 */

export default class AccordionGroup extends HTMLElement {
  constructor () {
    super();
    this.openAccordion = null;
  }

  connectedCallback () {
    this.addEventListener('accordion-action', this.onAccordionOpen.bind(this));
  }

  onAccordionOpen (event) {
    console.log(event);

    if (event.detail !== 'open') {
      return;
    }
    if (this.openAccordion && this.openAccordion !== event.target) {
      toggleVisibility(this.openAccordion.dropdown, 'close');
    }

    this.openAccordion = event.target; // Update the reference to the currently open accordion

  }
}

customElements.define('accordion-group', AccordionGroup);
