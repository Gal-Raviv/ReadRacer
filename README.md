# ReadRacer: Reading Experiment Web App

Welcome to ReadRacer! This project is a full-stack web application designed to run reading comprehension experiments. It features a modern, mobile-friendly React frontend and a Python backend (Azure Functions) for content generation, analysis, and user management.

## Features
- **Interactive Reading & Quiz Flow**: Users can participate in reading tasks, answer quizzes, and receive instant feedback.
- **Tutorial & Experiment Modes**: Includes a guided tutorial and randomized experiment conditions (with/without summary).
- **Google OAuth Login**: Secure authentication using Google accounts.
- **Results & Analytics**: Users can view their results and compare with global stats.
- **Mobile-First Design**: Responsive UI using Tailwind CSS for a seamless experience on any device.

## Tech Stack
- **Frontend**: React 19, Tailwind CSS, Framer Motion, Recharts
- **Backend**: Python (Azure Functions)
- **Authentication**: Google OAuth
- **Other**: Express Rate Limit, JWT Decode

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Python 3.10+ (for backend)

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Gal-Raviv/ReadRacer.git
   cd reading-experiment
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Create a `.env` file with your Google OAuth client ID:
   ```env
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
   ```
4. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup (Azure Functions)
1. Go to the `Functions` directory:
   ```bash
   cd ../Functions
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure your Azure Function settings in `local.settings.json` (do not commit secrets!).
4. Start the Azure Functions host:
   ```bash
   func host start
   ```

## Folder Structure
```
reading-experiment/   # React frontend
Functions/            # Python backend (Azure Functions)
```

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
MIT

---

**Note:**
- Do not commit secrets or sensitive files (e.g., `.env`, `local.settings.json`).
- For large files, use [Git LFS](https://git-lfs.github.com/).
- For questions or support, open an issue on GitHub.
