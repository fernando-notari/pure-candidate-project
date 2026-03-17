# Pure Candidate Assignment

This is a monorepo containing a React Native (Expo) mobile app and a tRPC backend server. You may feel free to edit or create any files unless otherwise directed by a comment at the top of the file. 

## Project Structure

```
├── apps/
│   └── mobile/           # React Native app (Expo)
├── packages/
│   ├── pure-backend/     # Express + tRPC API server (port 3141)
│   ├── pure-dao/         # Data access layer
│   └── pure-database/    # JSON-based data store & types
├── package.json          # Root workspace config
└── tsconfig.base.json    # Shared TypeScript config
```

## System Requirements

| Dependency | Minimum Version | Notes |
|---|---|---|
| **Node.js** | v18+ | LTS recommended |
| **npm** | v7+ | Required for workspaces support |
| **Expo Go** | Latest | Install on your iOS/Android device from the App Store or Google Play |

You will also need a physical device or emulator/simulator to run the mobile app via Expo Go.

## Getting Started

### 1. Install dependencies

From the project root:

```bash
npm install
```

This installs dependencies for all workspaces (mobile app, backend, DAO, and database).

### 2. Start the backend

```bash
npm run dev:backend
```

This launches the Express + tRPC API server on **http://localhost:3141** with hot-reload via `tsx watch`. You should see:

```
Backend running on http://localhost:3141
```

Keep this terminal running.

### 3. Start the mobile app

In a **separate terminal**, run:

```bash
npm run dev:mobile
```

This starts the Expo development server. You will see a QR code in the terminal.

### 4. Open in Expo Go

1. Open the **Expo Go** app on your phone.
2. Scan the QR code displayed in the terminal.
3. The app will bundle and load on your device.

> **Important:** Your phone and your development machine must be on the **same Wi-Fi network** for the app to connect to the backend. The app automatically detects the host IP from Expo and connects to the backend on port 3141.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev:backend` | Start the backend server with hot-reload |
| `npm run dev:mobile` | Start the Expo development server |
| `npm run format` | Format code with Biome |
| `npm run lint` | Lint code with Biome |
| `npm run check` | Run Biome format + lint checks |

## Submission

When you are finished, push your work to a new branch named `candidate/firstLast` in **camelCase**. For example, if your name is Jane Smith, your branch would be `candidate/janeSmith`. Ensure your code is properly formatted with Biome and that no lint errors are present.

```bash
git checkout -b candidate/janeSmith
git add .
git commit -m "your commit message"
git push -u origin candidate/janeSmith
```

**Do not** create a pull request.
