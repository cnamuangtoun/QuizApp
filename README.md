
# Django and React Quiz Application

This repository contains a full-stack quiz application with a Django REST framework backend and a React frontend. The application supports various types of quiz questions and authenticates users, allowing them to take quizzes and view their scores.

## Features

- **Backend (Django REST Framework):**
  - CRUD operations for quizzes, questions, and choices.
  - Support for different question types: single choice, multiple choice, and text-based answers.
  - User authentication and authorization.
  - User quiz attempt tracking and scoring.
  
- **Frontend (React):**
  - User authentication pages.
  - List quizzes available for users to take.
  - Present questions to the user and collect answers.
  - Display user scores after submitting quizzes.

## Tech Stack

- **Backend:** Django, Django REST Framework, Gunicorn, PostgreSQL
- **Frontend:** React, Axios for API requests, Bootstrap for styling
- **Deployment:** Heroku

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installing

A step by step series of examples that tell you how to get a development environment running:

#### Setting up the Backend

```bash
cd backend
# Create a virtual environment
python -m venv venv
# Activate virtual environment
source venv/bin/activate
# Install dependencies
pip install -r requirements.txt
# Apply migrations
python manage.py migrate
# Run the development server
python manage.py runserver
```

#### Setting up the Frontend

```bash
cd frontend
# Install dependencies
npm install
# Start the development server
npm start
```



