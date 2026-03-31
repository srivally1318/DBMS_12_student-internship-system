Student Internship Management System (SIMS) 🎓
A comprehensive full-stack web application designed to help students discover, manage, and track their internship applications effortlessly.

🌟 Features
User Authentication: Secure sign-up and login system for students.
Discover Internships: Browse a list of available internship opportunities.
Application Tracking: Apply for internships and track the status directly from your personalized dashboard.
Responsive Design: Clean, dynamic, and responsive user interface built using vanilla web technologies.
RESTful API: Robust Node.js and Express backend connecting to a MySQL database.
🛠️ Technology Stack
Frontend: HTML5, CSS3, Vanilla JavaScript
Backend: Node.js, Express.js
Database: MySQL
Dependencies: cors, dotenv, express, mysql2
🚀 Getting Started
Follow these steps to set up the project locally on your machine.

Prerequisites
Node.js installed
MySQL database installed and running
Installation & Setup
1. Clone the repository

git clone https://github.com/srivally1318/DBMS_12_student-internship-system.git
cd DBMS_12_student-internship-system
2. Setup the Database

Open your MySQL client or command line.
Execute the SQL file located in sql/schema.sql to setup the database tables.
3. Setup the Backend

cd backend
npm install
Create a .env file in the backend directory (you can use .env.example as a template).
Configure your database connection variables:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=internship_system
PORT=5000
Start the backend server:
npm run dev
The server should now be running on http://localhost:5000
4. Start the Frontend

You can serve the files in the frontend folder using any local development server.
Using Live Server in VS Code is highly recommended.
Simply right-click on frontend/index.html and select "Open with Live Server".
📂 Project Structure
├── backend/            # Express.js backend API
│   ├── controllers/    # Route controllers
│   ├── db/             # Database connection setup
│   ├── routes/         # Express endpoint routes
│   └── app.js          # Entry point for the server
├── frontend/           # Vanilla HTML, CSS, JS frontend
│   ├── index.html      # Landing page
│   ├── login.html      # User login
│   ├── dashboard.html  # Student dashboard
│   ├── style.css       # Global styles
│   └── script.js       # Frontend logic & API calls
└── sql/                # SQL scripts for database initialization
🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

📝 License
This project is licensed under the ISC License
