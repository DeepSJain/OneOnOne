# One-on-One Meeting Scheduler

## About
This is a web application that allows users to schedule one-on-one meetings with others. Users can create an account, log in, and schedule meetings with others. The application is built using Django for the backend and React for the frontend.

## Deployment
Backend: https://oneonone-qe0i.onrender.com/api
Frontend: https://csc309-frontend.onrender.com/

**Note**: The backend and frontend servers are deployed on Render. The backend server may take about a minute to start up.

## Local Instructions
1. Clone the repository.
2. Change dictionary to `backend`.
    a. Run `startup.sh` to set up the virtual environment.
    b. Run `run.sh` to start the backend server.
    c. Run `mail_server.sh` to start the mail server.
        - Emails that are sent will be printed to the console.
    d. Backend server will be running on `http://localhost:8000/api/`.
3. Change dictionary to `frontend`.
    a. run `startup.sh` to install the necessary packages.
    b. run `run.sh` to start the frontend server.
    c. Frontend server will be running on `http://localhost:3000/`.