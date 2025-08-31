import {LitElement, html, css} from 'lit';
import {getEmployees, saveEmployees} from '../utils/storage.js';
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
  };

  static styles = css`
    :host {
      display: block;
      padding: 16px;
      max-height: 100vh;
      max-width: 100vw;
    }
    .pageTitle {
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
    button {
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
    button:active {
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
    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: #1976d2;
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
        padding: 28px;
      }
    }
    @media (max-width: 600px) {
      form {
        grid-template-columns: 1fr;
        padding: 20px;
      }

      .field {
        width: 100%;
        margin: 0;
      }

      .actions {
        margin-top: 30px;
        flex-direction: column;
        align-items: center;
      }
      button {
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
  }

  connectedCallback() {
    super.connectedCallback();
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

  loadEmployee() {
    const employees = getEmployees() || [];
    const emp = employees.find((e) => String(e.id) === String(this.employeeId));
    if (!emp) {
      Router.go(`/employees?view=${this.previousView}`);
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
    const employees = getEmployees() || [];

    const employeeToSave = {
      ...this.employee,
      phone: '+' + this.employee.phone.replace(/\D/g, ''),
    };

    if (this.isEdit) {
      const index = employees.findIndex(
        (e) => String(e.id) === String(this.employeeId)
      );
      if (index >= 0) {
        employees[index] = {...employees[index], ...employeeToSave};
        saveEmployees(employees);
        this.message = 'Employee updated successfully!';
      } else {
        this.message = 'Error: Employee not found.';
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
      this.message = 'Employee added successfully!';
    }
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
      Router.go(`/employees?view=${this.previousView}`);
    }, 2000);
  }

  resetForm() {
    this.employee = {};
    this.invalidFields = {};
  }

  cancel() {
    Router.go(`/employees?view=${this.previousView}`);
  }

  render() {
    const title = this.isEdit ? 'Edit Employee' : 'Add Employee';
    const editMsg = this.isEdit
      ? `You are editing ${this.employee.firstName} ${this.employee.lastName}`
      : '';

    return html`
      <div class="pageTitle">${title}</div>
      <form @submit=${this.handleSubmit}>
        <div class="editMsg">${editMsg}</div>
        <div class="field">
          <label>First Name</label>
          <input
            name="firstName"
            class=${this.invalidFields.firstName ? 'error' : ''}
            .value=${this.employee.firstName || ''}
            @input=${this.handleChange}
            required
          />
        </div>
        <div class="field">
          <label>Last Name</label>
          <input
            name="lastName"
            class=${this.invalidFields.lastName ? 'error' : ''}
            .value=${this.employee.lastName || ''}
            @input=${this.handleChange}
            required
          />
        </div>
        <div class="field">
          <label>Date of Employment</label>
          <input
            type="date"
            name="employmentDate"
            .value=${this.employee.employmentDate || ''}
            @input=${this.handleChange}
          />
        </div>
        <div class="field">
          <label>Date of Birth</label>
          <input
            type="date"
            name="birthDate"
            .value=${this.employee.birthDate || ''}
            @input=${this.handleChange}
          />
        </div>
        <div class="field">
          <label>Phone</label>
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
          <label>Email</label>
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
          <label>Department</label>
          <select
            name="department"
            class=${this.invalidFields.department ? 'error' : ''}
            @input=${this.handleChange}
            required
          >
            <option value="">Select</option>
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
          <label>Position</label>
          <select
            name="position"
            class=${this.invalidFields.position ? 'error' : ''}
            @input=${this.handleChange}
            required
          >
            <option value="">Select</option>
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
            Save
          </button>
          <button type="button" class="cancel" @click=${this.cancel}>
            Cancel
          </button>
        </div>
      </form>
      ${this.showToast ? html`<div class="toast">${this.message}</div>` : ''}
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
