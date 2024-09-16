export default class Component {
  /**
   * The constructor for the Component class.
   *
   * @param {Object} [options] - The options object.
   * @param {HTMLElement} [options.element] - The element to bind the component to.
   * @param {Array<HTMLElement>} [options.elements] - The elements to create components for.
   * @param {HTMLElement} [options.controller] - The controller element. If not given, the
   *   component will be uncontrolled.
   */
  constructor({ element, elements, controller }) {
    this.selector = element;
    this.elements = elements;
    this.controller = controller;
    this.selectorChildren = {};

    this.create();
  }

  /**
   * Creates the component.
   *
   * This method is called in the constructor and it is responsible for setting up
   * the component's properties. It sets the `this.element` property to the
   * corresponding element in the DOM, and sets the `this.elements` property to
   * a NodeList or an array of elements if the component is supposed to control
   * multiple elements.
   *
   * @returns {void}
   */

  create() {
    if (this.selector instanceof window.HTMLElement) {
      this.element = this.selector;
    } else {
      this.element = document.querySelector(this.selector);
    }

    if (!(this.controller instanceof HTMLFormElement)) this.controller = document.querySelector(this.controller);

    if (this.elements instanceof window.HTMLElement || this.elements instanceof window.NodeList || Array.isArray(this.elements)) {
      this.elements = { ...this.elements };
    } else {
      this.elements = document.querySelectorAll(this.elements);

      if (this.elements.length === 0) {
        this.elements = null;
      }
    }
  }

  addEventListeners() {}

  removeEventListeners() {}
}
