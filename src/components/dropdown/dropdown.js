import each from 'lodash/each';

import Component from './Component';

export default class Dropdown extends Component {
  /**
   * The constructor for the Dropdown class.
   *
   * @param {Object} [options] - The options object.
   * @param {HTMLElement} [options.element] - The element to bind the dropdown to.
   * @param {Array<HTMLElement>} [options.elements] - The elements to create dropdowns for.
   */
  constructor({ element, elements }) {
    super({ element, elements });
    this.selector = this.element;
    this.elementnodes = {};
    this.timelines = {};
    this.map = new WeakMap();
    if (this.selector || this.elements) this.init();
  }

  createDropdown(element, key) {
    if (!(element instanceof HTMLElement) || typeof key !== 'number') return;
    this.elementnodes[key] = {};
    this.elementnodes[key].currentActive = {};
    this.elementnodes[key].node = document.createElement('div');
    this.elementnodes[key].searchnode = this.elementnodes[key].node.appendChild(document.createElement('div'));
    this.elementnodes[key].optionnodes = this.elementnodes[key].node.appendChild(document.createElement('div'));

    // Add the '__select' class
    this.elementnodes[key].node.classList.add('__select');

    // Add the name value as a class only if the name attribute exists
    if (element.hasAttribute('name')) {
      this.elementnodes[key].node.classList.add(element.getAttribute('name'));
    }

    // Add any other classes from the original element
    this.elementnodes[key].node.classList.add(...element.classList);

    this.elementnodes[key].searchnode.classList.add('__search_input');
    this.elementnodes[key].optionnodes.classList.add('option_wrapper');

    element.uid = key;
    this.map.set(element, key);
    this.elementnodes[key].optionMap = new WeakMap();

    each(element.querySelectorAll('option'), (_el, index) => {
      _el.url = index;
      this.elementnodes[key].optionMap.set(_el, index);
      this.elementnodes[key].noPlaceholder = element.dataset.noPlaceholder;

      if (index === 0 && !element.dataset.noPlaceholder) {
        this.elementnodes[key].searchnode.insertAdjacentHTML(
          'afterbegin',
          `<input type="text" placeholder="${_el.innerText}" autocomplete="off" class="search_" id="search_${key}"><span class="placeholder">${_el.innerText}</span>`
        );

        this.elementnodes[key].searchnode.querySelector('.search_').addEventListener('input', e => {
          if (e.target.value.trim() === '') this.elementnodes[key].searchnode.classList.remove('filled');
          else this.elementnodes[key].searchnode.classList.add('filled');
        });
      } else {
        if (index === 0 && element.dataset.noPlaceholder) {
          this.elementnodes[key].searchnode.insertAdjacentHTML('afterbegin', `<input type="text" autocomplete="off" class="search_" id="search_${key}">`);
        }
        this.elementnodes[key].optionnodes.insertAdjacentHTML('beforeend', `<div class="_option" data-value="${_el.dataset.value ? _el.dataset.value : ''}">${_el.innerText}</div>`);
        if (_el.selected) this.update(element, _el);
      }
    });
    element.parentNode.insertBefore(this.elementnodes[key].node, element);
    this.animation(this.elementnodes[key], key);
  }

  animation(element, key) {
    if (!element instanceof HTMLElement || typeof key !== 'number') return;
    this.timeline(key);
    element.searchnode.querySelector('.search_').addEventListener(
      'focus',
      () => {
        // this.elementnodes[key].optionnodes.style.display = ''
        this.timelines[key].play();
      },
      false
    );
    element.searchnode.querySelector('.search_').addEventListener(
      'blur',
      () => {
        if (this.elementnodes[key].currentActive.node) this.elementnodes[key].searchnode.classList.add('filled');
        // this.elementnodes[key].optionnodes.style.display = 'none'
        this.timelines[key].reverse();
      },
      false
    );
  }
  timeline(key) {
    if (typeof key !== 'number') return;
    this.timelines[key] = {};
    this.timelines[key].stack = false;
    this.elementnodes[key].optionnodes.style.display = 'none';
    this.elementnodes[key].optionnodes.style.backgroundColor = '#fff';

    this.timelines[key].play = () => {
      if (this.timelines[key].stack) clearTimeout(this.timelines[key].time);
      this.elementnodes[key].optionnodes.style.display = '';
      this.elementnodes[key].searchnode.classList.add('active');
      this.elementnodes[key].searchnode.classList.add('focused');
    };
    this.timelines[key].reverse = () => {
      if (this.timelines[key].stack) clearTimeout(this.timelines[key].time);
      this.timelines[key].stack = true;
      this.timelines[key].time = setTimeout(() => {
        this.timelines[key].stack = false;
        this.elementnodes[key].optionnodes.style.display = 'none';
        this.elementnodes[key].searchnode.classList.remove('active');
        this.elementnodes[key].searchnode.classList.remove('focused');
        each(this.elementnodes[key].optionnodes.childNodes, (element, index) => {
          element.style.display = '';
        });
      }, 150);
    };
  }

  drop(_element, key) {
    if (!_element instanceof HTMLElement || typeof key !== 'number') return;
    this.elementnodes[key].optionnodes.addEventListener('click', e => {
      e.preventDefault();
      each(_element.children, op => op.removeAttribute('selected'));
      this.update(e.srcElement, _element, key, Array.from(this.elementnodes[key].optionnodes.children).indexOf(e.srcElement));
      this.elementnodes[key].searchnode.classList.add('filled');
      this.timelines[key].reverse();
    });
  }

  /**
   * Updates the dropdown component with the selected option.
   * @param {HTMLElement} node The element to be updated.
   * @param {HTMLElement} _el The select element.
   * @param {number} key The key of the element in this.elementnodes.
   * @param {number} option The index of the selected option.
   * @returns {void}
   */
  update(node, _el, key, option) {
    if (!node instanceof HTMLElement || !_el instanceof HTMLElement) return;
    if (!key && node instanceof HTMLSelectElement) this.elementnodes[this.map.get(node)].searchnode.classList.add('filled');
    let i, o;
    _el &&
      ('SELECT' == node.nodeName ? ((i = this.map.get(node)), (o = this.elementnodes[i].optionMap.get(_el))) : ((i = key), (o = option)),
      this.elementnodes[i].currentActive.sel && this.elementnodes[i].currentActive.sel.removeAttribute('selected'),
      this.elementnodes[i].currentActive.node && this.elementnodes[i].currentActive.node.classList.remove('active'),
      (this.elementnodes[i].currentActive.sel = _el),
      'SELECT' == node.nodeName
        ? ((this.elementnodes[i].currentActive.node = this.elementnodes[i].optionnodes.children[o - 1]),
          (this.elementnodes[i].searchnode.querySelector('.search_').value = this.elementnodes[i].optionnodes.children[this.elementnodes[i].noPlaceholder ? o : o - 1].innerText),
          _el.setAttribute('selected', ''),
          (node.value = _el.value),
          this.elementnodes[i].optionnodes.children[this.elementnodes[i].noPlaceholder ? o : o - 1].classList.add('active'))
        : ((this.elementnodes[i].currentActive.node = node),
          (this.elementnodes[i].searchnode.querySelector('.search_').value = node.innerText),
          _el.children[this.elementnodes[i].noPlaceholder ? o : o + 1].setAttribute('selected', ''),
          (_el.value = _el.children[this.elementnodes[i].noPlaceholder ? o : o + 1].value),
          node.classList.add('active'),
          _el.dispatchEvent(new CustomEvent('change'))));
  }

  createSearch(node, key) {
    if (!node instanceof HTMLElement || typeof key !== 'number') return;
    this.elementnodes[key].searchnode.querySelector('.search_').addEventListener(
      'keyup',
      e => {
        each(this.elementnodes[key].optionnodes.childNodes, (element, index) => {
          let r = element.textContent || element.innerText;
          if ((!/[^A-Za-z0-9\s.,!?'"():;/[\]-]/.test(e.target.value) && element.dataset.value && (r = element.dataset.value), r.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1))
            element.style.display = '';
          else element.style.display = 'none';
        });
      },
      false
    );
    this.elementnodes[key].searchnode.querySelector('.search_').addEventListener(
      'blur',
      e => {
        if (this.elementnodes[key].currentActive.node && e.target.value !== this.elementnodes[key].currentActive.node) e.target.value = this.elementnodes[key].currentActive.node.innerText;
        else {
          e.target.value = '';
          this.elementnodes[key].searchnode.classList.remove('filled');
        }
      },
      false
    );
  }

  init(el) {
    if (el instanceof HTMLSelectElement) {
      let index = Object.keys(this.elementnodes).length;
      this.createDropdown(el, index);
      this.drop(el, index);
      this.createSearch(el, index);
      return;
    }
    if (this.selector instanceof HTMLSelectElement) {
      let index = Object.keys(this.elementnodes).length;
      this.createDropdown(this.selector, index);
      this.drop(this.selector, index);
      this.createSearch(this.selector, index);
      return;
    }
    if (this.initiated) return;
    this.initiated = true;
    if (this.elements)
      each(this.elements, (key, index) => {
        this.createDropdown(key, index);
        this.drop(key, index);
        this.createSearch(key, index);
      });
    else {
      let index = Object.keys(this.elementnodes).length + 1;
      this.createDropdown(this.element, index);
      this.drop(this.element, index);
      this.createSearch(this.element, index);
    }
  }

  // Listeners

  addEventListeners() {}

  removeEventListeners() {}
}
