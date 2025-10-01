// src/app.test.js
import {html, fixture, expect} from '@open-wc/testing';
import './components/employee-form.js';
import './components/navigation-menu.js';

describe('App components', () => {
  it('EmployeeForm renders', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    expect(el).to.exist;
  });

  it('NavigationMenu renders', async () => {
    const el = await fixture(html`<navigation-menu></navigation-menu>`);
    expect(el).to.exist;
  });
});
