/* globals customElements document */
import {ApiBaseElement} from './api-base.js'

// Template for the console panel
const template = `
<div id="console-container" style="position: relative; background: var(--base-background-color); padding: var(--space-0) var(--space-3) var(--space-7) var(--space-4); overflow-y: scroll; border-top: 1px solid var(--card-border-color); height: 100%; max-height: 100%;">
  <div style=" position: sticky; top: 0; left: 0; right: 0; margin-top: 0; margin-bottom: 0;">
    <h3 class="config-label mar-t-0 mar-b-0" style="padding-top: var(--space-3); z-index: 32; background: var(--base-background-color);">
      Console
    </h3>
    <div style="background: var(--base-background-color); display: flex; justify-content: flex-end; align-items: center; padding: var(--space-0); padding-block-end: var(--space-2)">
      <toggle-switch toggle-key="preserveLog">
        <span class="slab-text" style="margin-left: var(--space-1);">Preserve Log</span>
      </toggle-switch>
      <clear-button></clear-button>
    </div>
  </div>
  <pre id="console-output" style="padding: 0; margin: 0 0 var(--space-4) 0; white-space: pre-wrap; word-wrap: break-word;"></pre>
</div>

`

class ConsolePanel extends ApiBaseElement {
  updateConsole = ({result}) => {
    // Guard against element not being ready or API not injected yet
    if (!this.consoleOutput || !result) return

    const {error, logs} = result
    let update = ''
    if (error) {
      // Display error details in the console
      update = error?.details?.error ?? 'An error occurred.'
    } else {
      // Display regular logs
      update = logs ?? '' // Handle case where logs might be null/undefined
    }

    if (this.api.store.preserveLog) {
      this.consoleOutput.innerText = this.consoleOutput.innerText + update
    } else {
      this.consoleOutput.innerText = update
    }
  }

  clear = () => {
    const backUp = this.api.store.preserveLog
    this.api.store.result = {logs: undefined, error: undefined}
    this.querySelector('#console-output').innerText = ''
    this.api.store.preserveLog = backUp
  }

  connectedCallback() {
    this.innerHTML = template
    this.consoleOutput = this.querySelector('#console-output')
    this.addEventListener('clear-console', this.clear)

    // Subscribe to changes in the result state to update the console
    if (this.api) {
      this.api.subscribe(this.updateConsole, ['result'])
      // Initial update in case result is already populated
      if (this.api.store.result) {
        this.updateConsole({result: this.api.store.result})
      }
    } else {
      console.error('API context not available for console-panel on connect.')
      // Optionally, set up a mechanism to wait for API initialization if needed
    }
  }

  disconnectedCallback() {
    this.removeEventListener('clear-console', this.clear)
    // Unsubscribe when the element is removed from the DOM
    if (this.api) {
      this.api.unsubscribe(this.updateConsole)
    }
  }
}

// Define the new custom element
customElements.define('console-panel', ConsolePanel)
