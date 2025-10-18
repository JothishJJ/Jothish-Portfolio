/* globals customElements */
import {ApiBaseElement} from './api-base.js'

const template = `<ol class="hidden-lg" type="content" style="padding:0 16px;"></ol>
<fieldset class="hidden block-lg" style="padding:0 var(--space-3); margin-bottom: var(--space-3);"><select class="dropdown-select"></select></fieldset>
`

class FunctionList extends ApiBaseElement {
  functionClicked = (event) => {
    // eslint-disable-next-line unicorn/prefer-dom-node-text-content
    const target = this.api.store.functions.find((func) => func.name === event.srcElement.innerText)
    this.api.store.selectedIndex = target.name
  }
  functionSelected = (event) => {
    this.api.store.selectedIndex = event.srcElement.value
  }
  renderFunctions = () => {
    if (this.api.store.functions.length > 0) {
      this.list.innerHTML = this.api.store.functions
        .map((func) => {
          const selected = this.api.store.selectedIndex === func.name ? 'selected' : ''
          return `<li class="function-list-item ${selected}" style="padding: 16px 24px;">${func.name}</li>`
        })
        .join('')
      this.select.innerHTML = this.api.store.functions
        .map((func) => {
          const selected = this.api.store.selectedIndex === func.name ? 'selected' : ''
          return `<option value="${func.name}" ${selected}>${func.name}</option>`
        })
        .join('')
    } else {
      this.list.innerHTML = '<option class="pad-sm">No blueprint.json file found</li>'
      this.select.innerHTML = '<option>No blueprint.json file found</option>'
    }
  }

  connectedCallback() {
    this.innerHTML = template
    this.list = this.querySelector('ol')
    this.select = this.querySelector('select')
    this.list.addEventListener('click', this.functionClicked)
    this.select.addEventListener('change', this.functionSelected)
    this.api.subscribe(this.renderFunctions, ['functions', 'selectedIndex'])
    this.api.blueprint()
  }

  disconnectedCallback() {
    this.list.removeEventListener('click', this.functionClicked)
    this.select.removeEventListener('change', this.functionSelected)
    this.api.unsubscribe(this.renderFunctions)
  }
}

customElements.define('function-list', FunctionList)
