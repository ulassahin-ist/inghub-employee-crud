// src/data/employees.js
export const employees = Array.from({length: 891}, (_, i) => ({
  id: i + 1,
  firstName: 'Ahmet',
  lastName: 'Sourtimes',
  employmentDate: '2022-09-23',
  birthDate: '2022-09-23',
  phone: '+905321234567',
  email: 'ahmet@sourtimes.org',
  department: 'Analytics',
  position: 'Junior',
}));
