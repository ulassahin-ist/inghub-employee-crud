Employee Management Web App

A modern, responsive, and multilingual employee management system built with LitElement, JavaScript, and Vaadin Router. Designed to be intuitive for internal HR or admin use, featuring real-time validation, toast notifications, and confirm modals.

\- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \-

Features

Add, Edit, and View Employees

Fully editable employee form with real-time validation.

Prevents duplicate phone numbers and emails.

Supports dynamic editing with confirmation modal prompts.

Toast Notifications

Elegant animated notifications for success or errors.

Animations restart reliably for consecutive events.

Multilingual Support

Fully translatable interface using a centralized translations module.

Language switching updates all UI text dynamically.

Responsive Design

Grid-based layout adapts to desktop, tablet, and mobile devices.

Modern, clean UI with subtle shadows and rounded elements.

Persistent Storage

Employees saved in browser local storage (can be swapped for a backend later).

Data integrity with duplicate prevention and validation.

Clean Component Structure

Modular architecture using LitElement.

Components: EmployeeForm, EmployeeList, NavigationMenu.

Utility modules for storage, formatting, and translations.

\- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \-

Installation

Clone the repository:

git clone https://github.com/<username>/<repo>.git
cd <repo>

Install dependencies:

npm install

Start the development server:

npm start

Open your browser at http://localhost:3000.

\- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \-

Usage

Navigate to Employees → Add Employee to create a new employee.

Fields are validated in real-time:

Phone must be 12+ digits.

Email must be valid.

Required fields: first name, last name, phone, email, department, position.

Toast messages will show for errors or success.

Confirmation modals appear before saving changes.

\- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \-

Technical Highlights

Toast Handling

Uses a temporary state reset (showToast) to ensure animations run every time, even for repeated errors.

CSS animation fadeInOut for smooth fade in/out.

Validation & Error Handling

Duplicate detection for phone and email.

Prevents saving invalid or unchanged data when editing.

Routing

Vaadin Router handles /employees/new and /employees/:id.

Redirects to employee list if an invalid ID is accessed.

Responsive Grid

Uses CSS grid and media queries for mobile-friendly layouts.

Forms adapt dynamically for tablets and smartphones.

Code Organization

components/ for UI elements.

utils/ for formatting, storage, and translations.

CSS scoped to components with LitElement styles.
