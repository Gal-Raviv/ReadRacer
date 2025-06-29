# Read Racer

**Read Racer** is a browser-based reading comprehension experiment designed to test how AI-generated summaries impact users’ reading speed and accuracy. The platform combines original science fiction content, custom AI-generated questions, and real-time result tracking to support educational research.

## Features

- AI-generated passages and summaries in a controlled experiment
- Interactive quizzes with both multiple choice and written answers
- Dynamic visualizations of personal and global results
- Points system based on reading efficiency and accuracy
- Google Sign-In authentication
- Leaderboards for top-performing participants
- Tutorial mode to onboard users before the experiment

## Technology Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Azure Functions (JavaScript/Node.js)
- **AI Integration**: Azure OpenAI Service (AI Foundry)
- **Authentication**: Google OAuth 2.0
- **Storage**: Azure Table Storage
- **Hosting**: Azure Static Web Apps

## Getting Started

### Prerequisites

- Node.js and npm
- Azure Functions Core Tools
- Git

### Clone and Run Locally

#### Frontend

```bash
cd frontend
npm install
npm start
````

#### Backend

```bash
cd backend
npm install
func start
```

### Environment Variables

Ensure that your environment variables are configured for both frontend and backend (e.g., API keys, storage connection strings). These should not be committed to GitHub.

## Project Structure

```
read-racer/
├── frontend/       # React app
├── backend/        # Azure Functions (API layer)
├── README.md       # Project documentation
```

## Live Demo

A live version of the project is available here:

[coming soon]

**Note**: You must sign in with a Google account to participate in the experiment.

## How the Experiment Works

1. Users are randomly assigned to read either a full passage or a summary.
2. A comprehension quiz follows immediately after.
3. AI grading assigns a score and calculates points based on reading time and accuracy.
4. Data is stored and visualized both personally and globally.
5. Users can opt-in to appear on the public leaderboard.

## Author

**Gal Raviv**
Independent developer and researcher
For inquiries or collaboration, please reach out via GitHub
