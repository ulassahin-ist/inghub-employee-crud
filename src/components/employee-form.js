import {LitElement, html, css} from 'lit';
import {translations} from '../utils/language.js';
import {getEmployees, saveEmployees, AppState} from '../utils/storage.js';
import {formatPhone, formatPhoneInput} from '../utils/format.js';
import {Router} from '@vaadin/router';

export class EmployeeForm extends LitElement {
  static properties = {
    employeeId: {type: String},
    employee: {type: Object},
    originalEmployee: {type: Object},
    isEdit: {type: Boolean},
    message: {type: String},
    previousView: {type: String},
    showToast: {type: Boolean},
    invalidFields: {type: Object},
    lang: {type: String},
    showConfirmModal: {type: Boolean},
  };

  static styles = css`
    :host {
      display: block;
      padding: 16px 32px;
      box-sizing: border-box;
    }
    button {
      border: none;
      background: none;
      font-family: var(--text-font);
      transition: all 0.3s ease;
    }
    button:hover {
      filter: brightness(1.1);
    }
    .page-title {
      font-weight: 400;
      margin-bottom: 40px;
      font-size: 1.6rem;
      color: var(--primary);
    }
    .editMsg {
      position: absolute;
      top: 16px;
      left: 16px;
      font-weight: 500;
      margin-bottom: 40px;
      font-size: 13px;
      color: var(--text-dark);
    }
    form {
      position: relative;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      width: 100%;
      min-height: 70vh;
      box-sizing: border-box;
      background: white;
      padding: 70px;
      border-radius: 3px;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    }

    .field {
      display: flex;
      flex-direction: column;
      width: 80%;
      margin: 0 auto;
    }

    label {
      font-weight: 300;
      margin-bottom: 6px;
      font-size: 0.95rem;
      color: var(--text-dark);
    }
    input,
    select,
    textarea {
      padding: 8px 10px;
      border: 1px solid #ccc;
      border-radius: 6px;
      box-sizing: border-box;
      font-size: 0.95rem;
      transition: border-color 0.2s;
      width: 100%;
    }
    input:focus,
    select:focus,
    textarea:focus {
      border-color: var(--primary);
      outline: none;
    }
    input.error,
    select.error,
    textarea.error {
      border-color: #e53935;
      background: #ffeaea;
    }
    .actions {
      grid-column: 1 / -1;
      display: flex;
      justify-content: center;
      gap: 12px;
    }
    .actions button {
      border-radius: 6px;
      font-weight: 400;
      cursor: pointer;
      font-size: 0.95rem;
      transition: background 0.3s, transform 0.1s;
      width: 220px;
      height: 40px;
      margin: 20px;
      font-family: var(--text-font);
    }
    .actions button:active {
      transform: scale(0.97);
    }
    .approve {
      border: none;
      background: var(--primary);
      color: white;
    }
    .approve:hover:not(:disabled) {
      background: var(--primary);
    }
    .approve:disabled {
      cursor: not-allowed;
    }
    .cancel {
      border: 1px solid var(--secondary);
      background: white;
      color: var(--secondary);
    }
    .cancel:hover {
      background: #f2f8ff;
    }
    .reset {
      border: 1px solid #aaa;
      background: white;
      color: #555;
    }
    .reset:hover {
      background: #f9f9f9;
    }

    /* Confirm Modal Overlay */
    .confirm-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(200, 200, 200, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      animation: fadeIn 0.2s forwards;
    }
    .confirm-box {
      background: white;
      padding: 20px;
      width: 500px;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      gap: 12px;
      transform: translateY(-10px);
      animation: slideIn 0.2s forwards;
      position: relative;
      box-sizing: border-box;
    }
    .confirm-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
      font-size: 22px;
      color: var(--primary);
      position: relative;
    }
    .modal-close-btn {
      color: var(--primary);
      cursor: pointer;
    }
    .modal-close-btn svg {
      width: 30px;
      height: 30px;
    }
    .confirm-message {
      font-size: 14px;
      font-weight: 300;
      color: var(--text-dark);
      margin-bottom: 12px;
    }
    .confirm-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .confirm-buttons button {
      width: 100%;
      padding: 8px;
      border-radius: 10px;
      cursor: pointer;
      border: none;
      font-weight: 400;
    }
    .confirm-buttons button.proceed {
      background-color: var(--primary);
      color: white;
    }
    .confirm-buttons button.cancel {
      color: var(--secondary);
      border: 1px solid var(--secondary);
    }

    @keyframes slideIn {
      from {
        transform: translateY(-10px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    /* Toast Stylings*/
    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary);
      color: white;
      padding: 14px 28px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      opacity: 0;
      animation: fadeInOut 2s forwards;
      font-weight: 600;
    }
    @keyframes fadeInOut {
      0% {
        opacity: 0;
        transform: translate(-50%, 20px);
      }
      15% {
        opacity: 1;
        transform: translate(-50%, 0);
      }
      85% {
        opacity: 1;
        transform: translate(-50%, 0);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, 20px);
      }
    }
    @media (max-width: 900px) {
      form {
        grid-template-columns: repeat(2, 1fr);
        padding: 50px 28px 0;
      }
    }
    @media (max-width: 600px) {
       :host {
        padding: 0;
      }
      form {
        margin-top: 20px;
        grid-template-columns: 1fr;
        padding: 50px 20px 0;
      }
      .page-title {
        margin-bottom: 10px;
      }
      .field {
        width: 100%;
        margin: 0;
      }
      .actions {
        margin-top: 30px;
        flex-direction: column;
        align-items: center;
        gap: 0;
        margin-bottom: 10px;
      }
      .actions button {
        width: 100%;
        margin: 10px 0;
      }
    }
  `;

  constructor() {
    super();
    this.employeeId = null;
    this.employee = {};
    this.originalEmployee = {};
    this.isEdit = false;
    this.message = '';
    this.showToast = false;
    this.invalidFields = {};
    this.lang = AppState.lang || 'en';
    this.showConfirmModal = false;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('language-changed', this.onLanguageChanged);
    const path = window.location.pathname;
    if (path === '/employees/new') {
      this.isEdit = false;
      this.employee = {};
    } else {
      const match = path.match(/^\/employees\/([^/]+)$/);
      if (match) {
        this.employeeId = match[1];
        this.isEdit = true;
        this.loadEmployee();
      }
    }
  }

  disconnectedCallback() {
    window.removeEventListener('language-changed', this.onLanguageChanged);
    super.disconnectedCallback();
  }

  onLanguageChanged = (e) => {
    this.lang = e.detail;
  };
  get t() {
    return translations[this.lang] || translations.en;
  }

  loadEmployee() {
    const employees = getEmployees() || [];
    const emp = employees.find((e) => String(e.id) === String(this.employeeId));
    if (!emp) {
      Router.go(`/employees`);
      return;
    }

    this.employee = {
      ...emp,
      phone: formatPhone(emp.phone),
    };
    this.originalEmployee = {...this.employee};
    this.requestUpdate();
  }

  handleChange(e) {
    const {name, value} = e.target;

    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').replace(/^90/, '');
      const formatted = formatPhoneInput(digits);
      e.target.value = formatted;
      this.employee = {...this.employee, [name]: formatted};
      this.validateField(name, formatted);
      return;
    }

    this.employee = {...this.employee, [name]: value};
    this.validateField(name, value);
  }

  validateField(name, value) {
    let valid = true;
    if (!value) valid = false;
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '');
      valid = digits.length >= 12;
    }
    if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      valid = false;
    this.invalidFields = {...this.invalidFields, [name]: !valid};
  }

  get isFormValid() {
    const required = [
      'firstName',
      'lastName',
      'phone',
      'email',
      'department',
      'position',
    ];
    for (let field of required) {
      if (!this.employee[field] || this.invalidFields[field]) return false;
    }
    if (this.isEdit) {
      return (
        JSON.stringify(this.employee) !== JSON.stringify(this.originalEmployee)
      );
    }
    return true;
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.isFormValid) return;

    this.confirmAction = 'save';
    this.showConfirmModal = true;
  }
  async proceedConfirm() {
    this.showConfirmModal = false;

    if (this.confirmAction === 'save') {
      const employees = getEmployees() || [];

      const employeeToSave = {
        ...this.employee,
        phone: '+' + this.employee.phone.replace(/\D/g, ''),
      };

      const phoneDuplicate = employees.find(
        (emp) =>
          String(emp.id) !== String(this.employeeId) &&
          emp.phone === employeeToSave.phone
      );

      if (phoneDuplicate) {
        await this.showTempToast(this.t.error + this.t.phoneExists);
        return;
      }

      const emailDuplicate = employees.find(
        (emp) =>
          String(emp.id) !== String(this.employeeId) &&
          emp.email?.toLowerCase() === employeeToSave.email?.toLowerCase()
      );

      if (emailDuplicate) {
        await this.showTempToast(this.t.error + this.t.emailExists);
        return;
      }

      if (this.isEdit) {
        const index = employees.findIndex(
          (e) => String(e.id) === String(this.employeeId)
        );
        if (index >= 0) {
          employees[index] = {...employees[index], ...employeeToSave};
          saveEmployees(employees);
          await this.showTempToast(this.t.employeeUpdated);
        } else {
          await this.showTempToast(this.t.error + this.t.employeeNotFound);
        }
      } else {
        const maxId = employees.reduce((max, emp) => {
          const idNum = parseInt(emp.id, 10);
          return idNum > max ? idNum : max;
        }, 0);

        const newEmp = {...employeeToSave, id: (maxId + 1).toString()};
        employees.push(newEmp);
        saveEmployees(employees);
        this.employee = {};
        await this.showTempToast(this.t.employeeAdded);
      }

      Router.go(`/employees`);
    }
  }

  async showTempToast(message) {
    this.showToast = false;
    this.message = message;
    await this.updateComplete;
    this.showToast = true;

    return new Promise((resolve) => {
      setTimeout(() => {
        this.showToast = false;
        resolve();
      }, 3000);
    });
  }

  resetForm() {
    this.employee = {};
    this.invalidFields = {};
  }

  cancel() {
    Router.go(`/employees`);
  }

  renderConfirmModal() {
    if (!this.showConfirmModal) return html``;

    const actionText = this.isEdit
      ? `${this.t.confirmEdit} ${this.employee.firstName} ${this.employee.lastName}?`
      : `${this.t.confirmAdd} ${this.employee.firstName} ${this.employee.lastName}?`;

    return html`
      <div class="confirm-overlay">
        <div class="confirm-box">
          <div class="confirm-header">
            ${this.t.areYouSure}
            <button
              class="modal-close-btn"
              @click=${() => (this.showConfirmModal = false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div class="confirm-message">${actionText}</div>
          <div class="confirm-buttons">
            <button class="proceed" @click=${this.proceedConfirm.bind(this)}>
              ${this.t.proceed}
            </button>
            <button
              class="cancel"
              @click=${() => (this.showConfirmModal = false)}
            >
              ${this.t.cancel}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const title = this.isEdit ? this.t.editEmployee : this.t.addEmployee;
    const editMsg = this.isEdit
      ? `${this.t.youAreEditing} ${this.originalEmployee.firstName || ''} ${
          this.originalEmployee.lastName || ''
        }`
      : '';

    return html`
      <div class="page-title">${title}</div>
      <form @submit=${this.handleSubmit}>
        <div class="editMsg">${editMsg}</div>
        <div class="field">
          <label>${this.t.firstName}</label>
          <input
            name="firstName"
            class=${this.invalidFields.firstName ? 'error' : ''}
            .value=${this.employee.firstName || ''}
            @input=${this.handleChange}
            required
          />
        </div>
        <div class="field">
          <label>${this.t.lastName}</label>
          <input
            name="lastName"
            class=${this.invalidFields.lastName ? 'error' : ''}
            .value=${this.employee.lastName || ''}
            @input=${this.handleChange}
            required
          />
        </div>
        <div class="field">
          <label>${this.t.employmentDate}</label>
          <input
            type="date"
            name="employmentDate"
            .value=${this.employee.employmentDate || ''}
            @input=${this.handleChange}
          />
        </div>
        <div class="field">
          <label>${this.t.birthDate}</label>
          <input
            type="date"
            name="birthDate"
            .value=${this.employee.birthDate || ''}
            @input=${this.handleChange}
          />
        </div>
        <div class="field">
          <label>${this.t.phone}</label>
          <input
            name="phone"
            maxlength="19"
            class=${this.invalidFields.phone ? 'error' : ''}
            .value=${this.employee.phone || ''}
            @input=${this.handleChange}
            required
          />
        </div>
        <div class="field">
          <label>${this.t.email}</label>
          <input
            type="email"
            name="email"
            class=${this.invalidFields.email ? 'error' : ''}
            .value=${this.employee.email || ''}
            @input=${this.handleChange}
            required
          />
        </div>
        <div class="field">
          <label>${this.t.department}</label>
          <select
            name="department"
            class=${this.invalidFields.department ? 'error' : ''}
            @input=${this.handleChange}
            required
          >
            <option value="">${this.t.select}</option>
            <option
              value="Analytics"
              ?selected=${this.employee.department === 'Analytics'}
            >
              Analytics
            </option>
            <option
              value="Tech"
              ?selected=${this.employee.department === 'Tech'}
            >
              Tech
            </option>
          </select>
        </div>
        <div class="field">
          <label>${this.t.position}</label>
          <select
            name="position"
            class=${this.invalidFields.position ? 'error' : ''}
            @input=${this.handleChange}
            required
          >
            <option value="">${this.t.select}</option>
            <option
              value="Junior"
              ?selected=${this.employee.position === 'Junior'}
            >
              Junior
            </option>
            <option
              value="Medior"
              ?selected=${this.employee.position === 'Medior'}
            >
              Medior
            </option>
            <option
              value="Senior"
              ?selected=${this.employee.position === 'Senior'}
            >
              Senior
            </option>
          </select>
        </div>

        <div class="actions">
          <button type="submit" class="approve" ?disabled=${!this.isFormValid}>
            ${this.t.save}
          </button>
          <button type="button" class="cancel" @click=${this.cancel}>
            ${this.t.cancel}
          </button>
        </div>
      </form>
      ${this.renderConfirmModal()}
      ${this.showToast
        ? html`<div class="toast" key=${Date.now()}>${this.message}</div>`
        : ''}
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
