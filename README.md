Employee Management Web App

A modern, responsive, and multilingual employee management system built with LitElement, JavaScript, and Vaadin Router. Designed to be intuitive for internal HR or admin use, featuring real-time validation, toast notifications, and confirm modals.

\- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \- \-

This Employee Management Web Application fully implements all the requested features and requirements:

● Employee Records Listing

        Employees are displayed in a table view with pagination and search functionality.

        Users can edit or delete any employee directly from the list.

        The listing is fully responsive for both desktop and mobile.

● Add New Employee

        A reusable form allows adding a new employee with all required fields: First Name, Last Name, Employment/Birth Dates, Phone, Email, Department, and Position.

        Validation ensures correct input formats and prevents duplicate phone numbers or emails.

        After submission, users are redirected back to the employee list.

● Edit Existing Employee

        The same form is used for editing, prefilled with the employee’s data.

        A confirmation modal prompts before saving updates.

        Validations are applied consistently to maintain data integrity.

● Delete Employee

        Deleting an employee prompts a confirmation modal to prevent accidental deletions.

        The list updates immediately after deletion.

● Navigation & Routing

        A dedicated navigation menu allows switching between pages.

        Vaadin Router handles routing for /employees, /employees/new, and /employees/:id.

● State Management & Persistence

        Employee data is stored in browser memory using a custom storage utility.

        Changes persist during the session without a backend.

● Localization Support

        Components are fully multilingual (English and Turkish).

        The application dynamically reads the lang attribute from the root HTML.

● Responsive Design

        All pages and components adapt seamlessly to desktop, tablet, and mobile screens.

        No CSS frameworks like Bootstrap were used.

● Unit Testing

        Detailed unit tests cover all components and functions.


Coverage exceeds 85%, ensuring reliability.


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
