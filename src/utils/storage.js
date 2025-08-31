import {employees as initialEmployees} from '../data/employees.js';

export function getEmployees() {
  const data = localStorage.getItem('employees');
  try {
    return data ? JSON.parse(data) : [...initialEmployees];
  } catch {
    return [...initialEmployees];
  }
}

export function saveEmployees(employees) {
  localStorage.setItem('employees', JSON.stringify(employees));
}

if (!localStorage.getItem('employees')) {
  saveEmployees(initialEmployees);
}

export const AppState = {
  get view() {
    return localStorage.getItem('app_view') || 'list';
  },
  set view(val) {
    localStorage.setItem('app_view', val);
  },
  get pageIndex() {
    return Number(localStorage.getItem('app_pageIndex')) || 1;
  },
  set pageIndex(val) {
    localStorage.setItem('app_pageIndex', val);
  },
};
