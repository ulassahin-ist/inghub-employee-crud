import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';

import './components/navigation-menu.js';
import './components/employee-list.js';
import './components/employee-form.js';

import './utils/storage.js';

class AppShell extends LitElement {
  static styles = css`
    :host {
      display: block;

      margin: 0;
      padding: 0;
    }
    main {
      padding: 16px;
    }
  `;

  firstUpdated() {
    const outlet = this.renderRoot.querySelector('#outlet');
    const router = new Router(outlet);
    window.router = router;

    router.setRoutes([
      {path: '/', redirect: '/employees'},
      {path: '/employees', component: 'employee-list'},
      {path: '/employees/new', component: 'employee-form'},
      {path: '/employees/:id', component: 'employee-form'},
      {path: '(.*)', redirect: '/employees'},
    ]);
  }

  render() {
    return html`
      <navigation-menu></navigation-menu>
      <main id="outlet"></main>
    `;
  }
}

customElements.define('app-shell', AppShell);
