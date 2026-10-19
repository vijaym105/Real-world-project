# Moodify 🎵

Moodify is a web application that detects facial expressions through your webcam and uses the detected mood to fetch a matching collection of songs. The goal is to make music discovery feel more personal by connecting facial-expression detection with mood-based song recommendations.

## Features

- **Facial-expression detection:** Uses MediaPipe Face Landmarker to analyze facial expressions through the webcam.
- **Mood-based songs:** Requests songs from the backend based on the detected mood.
- **Music player:** Browse the returned songs and play music using the app's player.
- **Supported moods:** Happy, sad, confused, and neutral.
- **Web-based interface:** Built with React and Vite.
- **Separate frontend and backend:** The frontend communicates with a Node.js/Express API.

> **Privacy note:** Moodify needs camera permission to analyze facial expressions. The browser will ask you to grant access. Facial-expression classification is an estimate and should not be treated as a reliable measure of a person's actual emotional state.

## Tech Stack

### Frontend
- React
- Vite
- Axios
- MediaPipe Tasks Vision / Face Landmarker

### Backend
- Node.js
- Express
- MongoDB (if configured in your backend environment)

### Deployment
- Frontend: Render or another static/frontend hosting provider
- Backend: Render

## Project Structure

The repository contains two main folders:

```text
Real-world-project/
├── Moodify Frontend/
│   ├── src/
│   │   ├── features/
│   │   │   └── home/
│   │   ├── ...
│   ├── package.json
│   └── vercel.json
│
└── Moodify backend/
    ├── src/
    ├── routes/
    ├── config/
    ├── server.js
    └── package.json
```

The exact internal files may vary as the project evolves.

## How It Works

1. Open Moodify in a supported browser.
2. Grant camera permission when prompted.
3. Moodify initializes MediaPipe and analyzes the webcam video.
4. The frontend maps the detected expression to a mood.
5. The frontend requests songs from the backend using the mood query parameter.
6. The backend returns matching songs, and the frontend displays them in the music player.

## Run Locally

### Requirements

- Node.js and npm
- A working webcam
- Access to the configured database, if the backend uses one
- A modern browser with camera access enabled

### 1. Clone the repository

```bash
git clone https://github.com/vijaym105/Real-world-project.git
cd Real-world-project
```

### 2. Configure and start the backend

```bash
cd "Moodify backend"
npm install
```

Create a `.env` file in `Moodify backend/` and add the environment variables required by your backend configuration. At minimum, configure the frontend origin used for CORS:

```env
CLIENT_URL=http://localhost:5173
```

Also add your database connection string and any other variables required by the backend's configuration. Do not commit secrets or `.env` files to GitHub.

Start the backend using the script defined in `Moodify backend/package.json`. For example, if the project provides a development script:

```bash
npm run dev
```

If it provides a production start script, you can use:

```bash
npm start
```

The backend API is expected to be available locally at `http://localhost:3000` when configured to use port 3000.

### 3. Configure and start the frontend

Open a second terminal:

```bash
cd "Moodify Frontend"
npm install
```

Create a `.env` file in `Moodify Frontend/`:

```env
VITE_API_URL=http://localhost:3000
```

Run the Vite development server:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

> Vite environment variables are embedded during the build. Restart the development server after changing `.env`.

## Environment Variables

### Frontend

| Variable | Purpose | Local example |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:3000` |

For a deployed frontend, set `VITE_API_URL` to the public URL of the deployed backend, without adding `/api/song` to the end if the code appends that route itself.

### Backend

| Variable | Purpose | Example |
|---|---|---|
| `CLIENT_URL` | Frontend origin allowed by CORS | `http://localhost:5173` |
| Database variables | Connection settings required by the backend | Use the names expected by your backend configuration |

Set the production `CLIENT_URL` to the actual deployed frontend origin. Do not add a trailing slash unless your CORS configuration accounts for it. Add any additional backend environment variables required by the files in `config/` and `src/`.

**Never publish database credentials, API keys, or other secrets in this README or in source control.**

## API

The frontend uses the song endpoint:

### Get songs by mood

```http
GET /api/song?mood=happy
```

Example request:

```text
GET http://localhost:3000/api/song?mood=happy
```

The `mood` query parameter selects the mood used to retrieve songs. The application currently uses moods such as `happy`, `sad`, `confused`, and `neutral`.

The backend also contains a song route for creating/uploading song records. Check `Moodify backend/routes/song.route.js` for the current request body and validation requirements before using that endpoint.

## Deployment

### Backend on Render

1. Create a Render Web Service connected to the repository.
2. Set the backend's **Root Directory** to `Moodify backend`.
3. Configure the build command, typically `npm install`.
4. Configure the start command to match the backend package scripts, typically `npm start` if that script exists.
5. Add the required environment variables in Render's Environment settings.
6. Set `CLIENT_URL` to the deployed frontend's exact origin.
7. Deploy and check the service logs if the API does not respond.

### Frontend deployment

1. Create a frontend service connected to the repository.
2. Set its **Root Directory** to `Moodify Frontend`.
3. Set the build command to `npm install && npm run build`.
4. Set the publish/output directory to `dist` if the hosting provider asks for it.
5. Set `VITE_API_URL` to the deployed backend base URL, for example:

   ```env
   VITE_API_URL=https://YOUR-BACKEND.onrender.com
   ```

6. Redeploy after changing environment variables.

### CORS

The backend must allow both your local development origin and your deployed frontend origin. Configure CORS before mounting the API routes. If the frontend and backend use different domains, an incorrect CORS origin can cause browser requests to fail.

## Troubleshooting

### Camera does not start

- Allow camera access in the browser.
- Close other applications or browser tabs that may be using the webcam.
- Confirm the webcam works in your operating system's camera app.
- Reload the page after releasing the camera.
- Check the browser console for `NotReadableError`, which can indicate that the camera device could not be started.

### Axios reports `Network Error` or a CORS error

- Confirm the backend service is running.
- Open the API endpoint directly to see whether the server responds.
- Check `VITE_API_URL` and make sure it points to the backend, not the frontend.
- Confirm `CLIENT_URL` matches the frontend's origin exactly.
- Make sure CORS middleware runs before the song routes.
- Inspect the browser's Network tab and the Render logs for the underlying HTTP status.

### Songs do not load

- Check that the request includes a supported `mood` query parameter.
- Confirm the backend route is mounted at `/api/song`.
- Check backend logs and database connectivity.
- Verify that matching song records exist in the data source used by the backend.

## Security Notes

- Keep `.env` files out of version control.
- Rotate any credentials or API keys that were previously committed to a public repository.
- If the song-creation/upload endpoint is public, add appropriate authentication, validation, rate limiting, and upload restrictions before using it in production.
- Request camera permission only when needed and stop the camera stream when the feature is no longer active.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Commit your changes with a clear message.
5. Open a pull request describing the change.

## License

No license is specified here. Add a `LICENSE` file if you intend to publish the project for reuse, and choose a license that matches your intentions.
