Employee Management Form

A simple web component built with Lit for adding and editing employee information. Includes validation, responsive design, and toast notifications.

################################################

Features

Add and edit employees.

Form validation with inline error messages.

Responsive layout for desktop and mobile.

Toast notifications for success messages.

Auto-formatting for dates and phone numbers.

Easy to extend (departments, positions, etc.).

################################################

Installation

Clone the repository:

git clone https://github.com/your-username/employee-form.git

Install dependencies (if using a bundler or dev server):

npm install

Run your development server (example using vite):

npm run dev

################################################

Usage

Navigate to /employees/new to add a new employee.

Navigate to /employees/{id} to edit an existing employee.

Required fields: First Name, Last Name, Phone, Email, Department, Position.

Optional fields: Employment Date, Birth Date, Notes.

################################################

Project Structure
├── .vscode
├── src
│ ├── assets
│ │ ├── images
│ ├── components
│ ├── css
│ ├── data
│ ├── utils
├── test
├── test-results

################################################

Dependencies

Lit
– For building web components.

Vaadin Router
– For client-side routing.

################################################

Contributing

Fork the repository.

Create a new branch: git checkout -b feature-name

Make your changes and commit: git commit -m "Add feature"

Push to your branch: git push origin feature-name

Open a Pull Request.
