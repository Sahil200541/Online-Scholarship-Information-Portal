Online Scholarship Information Portal
-------------------------------------

An online web application that provides detailed information about various scholarships for students. The portal allows users to view scholarship listings, search and filter them, and access details like amount, eligibility, and application deadlines.

Features:
---------
- View a list of available scholarships
- Search scholarships by keyword
- See detailed information including:
    - Scholarship Name
    - Amount
    - Eligibility
    - Deadline
    - Application Link
- Fully responsive design (works on mobile, tablet, and desktop)
- Beautiful UI with informative icons
- Backend API integrated using Axios (if running in development mode)

Technologies Used:
------------------
Frontend:
- React JS (for building UI)
- React Router DOM (for routing)
- Axios (for API calls)
- FontAwesome (for icons)
- CSS (for styling)
- GH-Pages (for deploying frontend to GitHub Pages)

Backend (optional):
- Node.js and Express.js (for API)
- MongoDB (if storing dynamic data)

Icons Used (from FontAwesome):
------------------------------
- Graduation Cap Icon (fa-graduation-cap): For scholarship header
- Search Icon (fa-search): For the search bar
- Clock Icon (fa-clock): To indicate deadlines
- Coins Icon (fa-coins): For scholarship amount
- Link Icon (fa-link): For external application link

Project Folder Structure (Frontend):
------------------------------------
src/
├── Components/
│   ├── JSX/         -> Contains all React components
│   └── CSS/         -> Contains component-specific CSS files
├── App.js
├── index.js
├── ...

Installation Instructions:
--------------------------
1. Clone the repository:
   git clone https://github.com/Sahil200541/Online-Scholarship-Information-Portal.git

2. Move into the project directory:
   cd Online-Scholarship-Information-Portal

3. Install dependencies:
   npm install

Running the Project Locally:
----------------------------
Start the development server:
   npm start

Runs the app in development mode at:
   http://localhost:3000

Proxy Support for Local Backend:
--------------------------------
To enable local API communication, this line is added to package.json:
   "proxy": "http://localhost:5000"

This allows API calls like:
   axios.get("/api/scholarships")

instead of hardcoding the full localhost URL.

Deployment:
-----------
The project is deployed at:
https://Sahil200541.github.io/Online-Scholarship-Information-Portal

Backend Hosting:
----------------
If backend is hosted (e.g., on Render), update Axios URLs to use the hosted API:
   https://your-backend.onrender.com/api/scholarships

Developer Info:
---------------
Name: Sahil Laha
Role: Frontend Developer & BCA Student
GitHub: https://github.com/Sahil200541

License:
--------
This project is licensed under the MIT License.
```

---

Let me know if you’d like a second version with backend API details too or `.env` instructions for live URL switching.
