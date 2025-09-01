import {LitElement, html, css} from 'lit';
import {AppState, getEmployees, saveEmployees} from '../utils/storage.js';
import {Router} from '@vaadin/router';

export class EmployeeList extends LitElement {
  static properties = {
    employees: {type: Array},
    currentPage: {type: Number},
    pageSize: {type: Number},
    view: {type: String},
    isLoading: {type: Boolean},
    showConfirmModal: {type: Boolean},
    employeeSelected: {type: Object},
    showToast: {type: Boolean},
    message: {type: String},
    searchQuery: {type: String},
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
    .pageTitle {
      font-weight: 400;
      margin-bottom: 20px;
      font-size: 1.6rem;
      color: var(--primary);
    }
    .loading {
      text-align: center;
      padding: 2rem;
      font-style: italic;
      color: #666;
    }
    .sub-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      width: 100%;
    }
    .sub-header h2 {
      margin: 0;
    }
    .sub-header .buttons {
      display: flex;
      gap: 8px;
    }
    .sub-header button {
      cursor: pointer;
      color: var(--primary-light);
    }
    .sub-header button svg {
      width: 40px;
      height: 40px;
    }
    .sub-header button.active {
      cursor: default;
      color: var(--primary);
    }
    .search-input {
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid #ccc;
      font-size: 0.95rem;
      margin-right: 16px;
    }

    /* Table Stylings */
    .table-container {
      overflow: hidden;
      border-radius: 8px;
      width: 100%;
      max-height: calc(100vh - 210px);
      overflow: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      background: var(--white);
    }
    th,
    td {
      border-bottom: 1px solid #ddd;
      padding: 20px 0;
      text-align: center;
      font-weight: 400;
      color: var(--text-medium);
      background: var(--white);
    }
    th {
      color: var(--primary);
    }
    table td:nth-child(-n + 3) {
      font-weight: 400;
      color: var(--text-dark);
    }
    table td:first-child,
    table th:first-child {
      padding: 22px;
    }
    table td:last-child,
    table th:last-child {
      padding: 22px;
    }
    table button {
      margin-right: 4px;
      padding: 4px 8px;
      color: var(--primary);
      cursor: pointer;
    }
    table button svg {
      width: 20px;
      height: 20px;
    }
    input[type='checkbox'] {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 6px;
      border: 1px solid #ccc;
      background-color: #f8f8f8;
      cursor: pointer;
      position: relative;
      transition: all 0.2s ease;
    }
    input[type='checkbox']:checked {
      background-color: var(--primary);
      border-color: var(--primary);
    }

    /* Card Stylings */
    .cards-container {
      padding: 20px 52px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 40px 100px;
      max-height: calc(100vh - 225px);
      overflow: auto;
    }
    .employee-card {
      background: #ffffff;
      box-shadow: 2px 3px 6px -2px #6d6d6d;
      padding: 20px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .employee-card div {
      display: flex;
      flex-direction: column;
      color: var(--text-dark);
      margin-bottom: 8px;
      font-size: 17px;
      line-height: 1.2;
    }
    .employee-card div span {
      color: var(--text-light);
      font-weight: 300;
      font-size: 14px;
      line-height: 1.2;
    }
    .employee-card .actions {
      display: flex;
      flex-direction: row;
    }
    .employee-card .actions button {
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      color: var(--white);
      font-weight: 500;
      display: flex;
      margin-right: 8px;
    }
    .employee-card .actions button svg {
      width: 20px;
      height: 20px;
    }
    .employee-card .actions button.edit {
      background-color: var(--secondary);
    }
    .employee-card .actions button.delete {
      background-color: var(--primary);
    }

    /* Pagination Stylings */
    .pagination {
      justify-content: center;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
    }
    .pagination button {
      margin: 0;
      padding: 0;
      border: none;
      background: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      color: var(--text-medium);
      font-family: 'Montserrat', sans-serif;
      font-weight: 400;
      font-size: 14px;
    }

    .nav-icon {
      width: 20px;
      height: 32px;
      color: var(--primary);
    }
    .pagination button.active {
      background: var(--primary);
      color: white;
      cursor: default;
      font-size: 16px;
    }
    .pagination button:disabled svg,
    .pagination button:disabled {
      color: gray !important;
      cursor: default;
    }
    .pagination span {
      display: inline-block;
      line-height: 32px;
      vertical-align: middle;
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
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
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

    /* Toast Stylings */
    .toast {
      position: fixed;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      opacity: 0.9;
      font-weight: bold;
    }
  `;

  constructor() {
    super();
    this.isLoading = true;
    this.employees = [];
    this.showConfirmModal = false;
    this.employeeSelected = null;
    this.confirmAction = null;
    this.showToast = false;
    this.message = '';
    this.searchQuery = '';

    this.view = AppState.view || 'list';
    this.currentPage = AppState.pageIndex || 1;
    this.pageSize = this.view === 'cards' ? 4 : 8;

    setTimeout(() => {
      this.employees = getEmployees() || [];
      const totalPages =
        Math.ceil(this.filteredEmployees.length / this.pageSize) || 1;
      if (this.currentPage > totalPages) this.currentPage = totalPages;
      this.isLoading = false;
    }, 200);
  }

  get filteredEmployees() {
    if (!this.searchQuery) return this.employees;

    const q = this.searchQuery.toLowerCase();

    return this.employees.filter((emp) =>
      Object.values(emp).some((val) => String(val).toLowerCase().includes(q))
    );
  }

  handleSearch(e) {
    this.searchQuery = e.target.value;
    this.currentPage = 1;
    AppState.pageIndex = 1;
    this.requestUpdate();
  }

  editEmployee(emp) {
    this.employeeSelected = emp;
    this.confirmAction = 'edit';
    this.showConfirmModal = true;
  }

  requestDelete(emp) {
    this.employeeSelected = emp;
    this.confirmAction = 'delete';
    this.showConfirmModal = true;
  }

  proceedDelete() {
    if (!this.employeeSelected) return;
    const id = this.employeeSelected.id;
    this.employees = this.employees.filter((emp) => emp.id !== id);
    saveEmployees(this.employees);
    this.showConfirmModal = false;
    this.employeeSelected = null;
    this.confirmAction = null;

    this.message = 'Employee was deleted successfully!';
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 1200);

    const totalPages =
      Math.ceil(this.filteredEmployees.length / this.pageSize) || 1;
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
      AppState.pageIndex = totalPages;
    }
    this.requestUpdate();
  }

  proceedConfirm() {
    if (!this.employeeSelected) return;

    if (this.confirmAction === 'delete') {
      this.proceedDelete();
    } else if (this.confirmAction === 'edit') {
      Router.go(`/employees/${this.employeeSelected.id}`);
      this.showConfirmModal = false;
      this.message = 'Employee edit confirmed!';
      this.showToast = true;
      this.employeeSelected = null;
      this.confirmAction = null;
      setTimeout(() => (this.showToast = false), 1200);
    }
  }

  toggleRow(emp, e) {
    emp.selected = e.target.checked;
    this.requestUpdate();
  }

  toggleAll(e) {
    const checked = e.target.checked;
    this.employees.forEach((emp) => (emp.selected = checked));
    this.requestUpdate();
  }
  renderPagination() {
    const totalPages = Math.ceil(this.filteredEmployees.length / this.pageSize);
    if (totalPages <= 1) return html``;

    const pages = [];
    const maxButtons = 5;
    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);

    for (let i = start; i <= end; i++) {
      pages.push(
        html`<button
          class="${i === this.currentPage ? 'active' : ''}"
          @click="${() => {
            this.currentPage = i;
            AppState.pageIndex = i;
          }}"
        >
          ${i}
        </button>`
      );
    }

    return html`
      <button
        @click="${() => {
          if (this.currentPage > 1) {
            this.currentPage--;
            AppState.pageIndex = this.currentPage;
          }
        }}"
        ?disabled=${this.currentPage === 1}
      >
        <svg
          class="nav-icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      ${start > 1
        ? html`<button
            @click="${() => {
              this.currentPage = 1;
              AppState.pageIndex = 1;
            }}"
          >
            1
          </button>`
        : ''}
      ${start > 2 ? html`<span>...</span>` : ''} ${pages}
      ${end < totalPages - 1 ? html`<span>...</span>` : ''}
      ${end < totalPages
        ? html`<button
            @click="${() => {
              this.currentPage = totalPages;
              AppState.pageIndex = totalPages;
            }}"
          >
            ${totalPages}
          </button>`
        : ''}
      <button
        @click="${() => {
          if (this.currentPage < totalPages) {
            this.currentPage++;
            AppState.pageIndex = this.currentPage;
          }
        }}"
        ?disabled=${this.currentPage === totalPages}
      >
        <svg
          class="nav-icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    `;
  }

  renderSubHeader() {
    return html`
      <div class="sub-header">
        <h2 class="pageTitle">Employee List</h2>
        <input
          type="text"
          placeholder="Search..."
          @input=${this.handleSearch}
          class="search-input"
        />
        <div class="buttons">
          <button
            style="transform: translateY(-0.5px)"
            class=${this.view === 'list' ? 'active' : ''}
            @click=${() => {
              this.view = 'list';
              this.pageSize = 8;
              this.currentPage = 1;
              AppState.view = 'list';
              AppState.pageIndex = 1;
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path d="M3 5h18" />
              <path d="M3 12h18" />
              <path d="M3 19h18" />
            </svg>
          </button>
          <button
            class=${this.view === 'cards' ? 'active' : ''}
            @click=${() => {
              this.view = 'cards';
              this.pageSize = 4;
              this.currentPage = 1;
              AppState.view = 'cards';
              AppState.pageIndex = 1;
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
              />
            </svg>
          </button>
        </div>
      </div>
    `;
  }
  renderConfirmModal() {
    if (!this.showConfirmModal || !this.employeeSelected) return html``;
    const {firstName, lastName} = this.employeeSelected;
    const actionText =
      this.confirmAction === 'delete'
        ? `Selected Employee record of ${firstName} ${lastName} will be deleted`
        : `Do you want to edit the record of ${firstName} ${lastName}?`;

    return html`
      <div class="confirm-overlay">
        <div class="confirm-box">
          <div class="confirm-header">
            Are you sure?
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
              Proceed
            </button>
            <button
              class="cancel"
              @click=${() => (this.showConfirmModal = false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderTable() {
    const startIdx = (this.currentPage - 1) * this.pageSize;
    const pageEmployees = this.filteredEmployees.slice(
      startIdx,
      startIdx + this.pageSize
    );

    return html`
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" @change=${this.toggleAll} /></th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Employment Date</th>
              <th>Birth Date</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${pageEmployees.map(
              (emp) => html`
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      .checked=${emp.selected || false}
                      @change=${(e) => this.toggleRow(emp, e)}
                    />
                  </td>
                  <td>${emp.firstName}</td>
                  <td>${emp.lastName}</td>
                  <td>${emp.employmentDate}</td>
                  <td>${emp.birthDate}</td>
                  <td>${emp.phone}</td>
                  <td>${emp.email}</td>
                  <td>${emp.department}</td>
                  <td>${emp.position}</td>
                  <td>
                    <button @click=${() => this.editEmployee(emp)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                    <button
                      class="delete"
                      @click=${() => this.requestDelete(emp)}
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
                        class="lucide lucide-trash-icon lucide-trash"
                      >
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                        <path d="M3 6h18" />
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
      <div class="pagination">${this.renderPagination()}</div>
    `;
  }

  renderCards() {
    const startIdx = (this.currentPage - 1) * this.pageSize;
    const pageEmployees = this.filteredEmployees.slice(
      startIdx,
      startIdx + this.pageSize
    );

    return html`
      <div class="cards-container">
        ${pageEmployees.map(
          (emp) => html`
            <div class="employee-card">
              <div><span>First Name:</span> ${emp.firstName}</div>
              <div><span>Last Name:</span> ${emp.lastName}</div>
              <div><span>Employment Date:</span> ${emp.employmentDate}</div>
              <div><span>Birth Date:</span> ${emp.birthDate}</div>
              <div><span>Phone:</span> ${emp.phone}</div>
              <div><span>Email:</span> ${emp.email}</div>
              <div><span>Department:</span> ${emp.department}</div>
              <div><span>Position:</span> ${emp.position}</div>
              <div class="actions">
                <button class="edit" @click=${() => this.editEmployee(emp)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                  &nbsp Edit
                </button>
                <button class="delete" @click=${() => this.requestDelete(emp)}>
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
                    class="lucide lucide-trash-icon lucide-trash"
                  >
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M3 6h18" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  &nbsp Delete
                </button>
              </div>
            </div>
          `
        )}
      </div>
      <div class="pagination">${this.renderPagination()}</div>
    `;
  }

  render() {
    if (this.isLoading)
      return html`<div class="loading">Loading employees...</div>`;
    if (this.employees.length === 0)
      return html`<div>No employees found.</div>`;

    return html`
      ${this.renderSubHeader()}
      ${this.view === 'list' ? this.renderTable() : this.renderCards()}
      ${this.renderConfirmModal()}
      ${this.showToast ? html`<div class="toast">${this.message}</div>` : ''}
    `;
  }
}

customElements.define('employee-list', EmployeeList);
