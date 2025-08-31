import {LitElement, html, css} from 'lit';
import {getEmployees, saveEmployees} from '../utils/storage.js';

export class EmployeeCards extends LitElement {
  static properties = {
    employees: {type: Array},
    currentPage: {type: Number},
    pageSize: {type: Number},
  };

  constructor() {
    super();
    this.employees = getEmployees() || [];
    this.currentPage = 1;
    this.pageSize = 4; // 4 cards per page
  }

  static styles = css`
    .cards-container {
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }

    .card {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      padding: 16px;
      border-radius: 8px;
      background: #fff;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .card div {
      margin-bottom: 6px;
    }

    .actions {
      grid-column: span 2;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }

    button {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      background: #1976d2;
      color: white;
    }

    button.delete {
      background: #d32f2f;
    }

    .pagination {
      margin-top: 16px;
      text-align: center;
    }

    .pagination button {
      margin: 0 4px;
      padding: 6px 12px;
      border: 1px solid #1976d2;
      border-radius: 4px;
      background: white;
      color: #1976d2;
      cursor: pointer;
    }

    .pagination button[disabled] {
      background: #1976d2;
      color: white;
      cursor: default;
    }
  `;

  deleteEmployee(id) {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    this.employees = this.employees.filter((emp) => emp.id !== id);
    saveEmployees(this.employees);
    if (this.currentPage > Math.ceil(this.employees.length / this.pageSize)) {
      this.currentPage = Math.max(
        Math.ceil(this.employees.length / this.pageSize),
        1
      );
    }
    this.requestUpdate();
  }

  editEmployee(id) {
    window.router.render(`/employees/${id}`);
  }

  changePage(page) {
    this.currentPage = page;
  }

  renderPagination() {
    const totalPages = Math.ceil(this.employees.length / this.pageSize);
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(html`
        <button
          @click=${() => this.changePage(i)}
          ?disabled=${i === this.currentPage}
        >
          ${i}
        </button>
      `);
    }
    return html`<div class="pagination">${pages}</div>`;
  }

  render() {
    const startIdx = (this.currentPage - 1) * this.pageSize;
    const pageEmployees = this.employees.slice(
      startIdx,
      startIdx + this.pageSize
    );

    return html`
      <div class="cards-container">
        ${pageEmployees.map(
          (emp) => html`
            <div class="card">
              <div><strong>First Name:</strong> ${emp.firstName}</div>
              <div><strong>Last Name:</strong> ${emp.lastName}</div>
              <div><strong>Employment Date:</strong> ${emp.employmentDate}</div>
              <div><strong>Birth Date:</strong> ${emp.birthDate}</div>
              <div><strong>Phone:</strong> ${emp.phone}</div>
              <div><strong>Email:</strong> ${emp.email}</div>
              <div><strong>Department:</strong> ${emp.department}</div>
              <div><strong>Position:</strong> ${emp.position}</div>
              <div class="actions">
                <button @click=${() => this.editEmployee(emp.id)}>Edit</button>
                <button
                  class="delete"
                  @click=${() => this.deleteEmployee(emp.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          `
        )}
      </div>

      ${this.renderPagination()}
    `;
  }
}

customElements.define('employee-cards', EmployeeCards);
