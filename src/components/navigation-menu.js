import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';
import {translations} from '../utils/language.js';
import {AppState} from '../utils/storage.js';

class NavigationMenu extends LitElement {
  static properties = {
    lang: {type: String},
    currentPath: {type: String},
  };

  constructor() {
    super();
    this.lang = AppState.lang;
    this.currentPath = window.location.pathname;
  }

  static styles = css`
    .top-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background-color: var(--white);
      color: var(--black);
    }
    .logo-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .logo {
      border-radius: 4px;
      width: 24px;
      height: 24px;
      object-fit: contain;
    }
    .top-header .buttons {
      display: flex;
      gap: 16px;
      margin-left: auto;
    }
    .top-header button {
      cursor: pointer;
      border: none;
      background: none;
      color: var(--primary-light);
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: filter 0.2s;
      font-family: var(--text-font);
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 4px;
    }
    .top-header button:hover {
      filter: brightness(1.1);
    }
    .top-header button.active {
      color: var(--primary);
      cursor: default;
    }
    .language {
      width: 24px;
      object-fit: contain;
    }
    @media (max-width: 600px) {
      .top-header .buttons {
        gap: 0;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('vaadin-router-location-changed', this.updatePath);
  }

  disconnectedCallback() {
    window.removeEventListener(
      'vaadin-router-location-changed',
      this.updatePath
    );
    super.disconnectedCallback();
  }

  updatePath = (e) => {
    this.currentPath = e.detail.location.pathname;
    this.requestUpdate();
  };

  navigate(path) {
    Router.go(path);
  }

  toggleLang() {
    AppState.lang = AppState.lang === 'en' ? 'tr' : 'en';
    this.lang = AppState.lang;
    document.documentElement.lang = this.lang;
    this.requestUpdate();

    window.dispatchEvent(
      new CustomEvent('language-changed', {detail: this.lang})
    );
  }
  get t() {
    return translations[this.lang] || translations.en;
  }

  render() {
    return html`
      <div class="top-header">
        <div class="logo-title">
          <img src="/src/assets/images/logo.png" alt="ING" class="logo" />
          <span class="company-name">ING</span>
        </div>
        <div class="buttons">
          <button
            class=${this.currentPath === '/employees' ? 'active' : ''}
            @click=${() => this.navigate('/employees')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-user-round-search"
            >
              <circle cx="10" cy="8" r="5" />
              <path d="M2 21a8 8 0 0 1 10.434-7.62" />
              <circle cx="18" cy="18" r="3" />
              <path d="m22 22-1.9-1.9" />
            </svg>
            &nbsp ${this.t.employees}
          </button>

          <button
            class=${this.currentPath === '/employees/new' ? 'active' : ''}
            @click=${() => this.navigate('/employees/new')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            &nbsp ${this.t.addEmployee}
          </button>

          <button @click=${this.toggleLang}>
            <img
              class="language"
              src="/src/assets/images/${this.lang === 'en' ? 'tr' : 'en'}.png"
              alt="${this.lang === 'en' ? 'tr' : 'en'}"
            />
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('navigation-menu', NavigationMenu);
