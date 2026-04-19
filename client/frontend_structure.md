frontend/
│
├── public/
│ └── index.html
│
├── src/
│ │
│ ├── app/ # App-level setup
│ │ ├── App.jsx
│ │ ├── routes.jsx # if routing needed later
│ │ └── providers.jsx # global providers (future)
│ │
│ ├── components/ # reusable UI components
│ │ ├── ui/ # basic UI elements
│ │ │ ├── Button.jsx
│ │ │ ├── Input.jsx
│ │ │ └── Card.jsx
│ │ │
│ │ ├── chat/ # chat-specific components
│ │ │ ├── ChatBox.jsx
│ │ │ ├── MessageBubble.jsx
│ │ │ └── ChatInput.jsx
│ │ │
│ │ └── widget/ # floating widget UI
│ │ ├── WidgetContainer.jsx
│ │ ├── WidgetHeader.jsx
│ │ └── WidgetToggle.jsx
│ │
│ ├── features/ # feature-based logic (IMPORTANT)
│ │ └── assistant/
│ │ ├── assistantApi.js # API calls (/ask endpoint)
│ │ ├── assistantSlice.js (optional if state lib used)
│ │ ├── assistantHooks.js
│ │ └── assistantUtils.js
│ │
│ ├── services/ # external communication layer
│ │ ├── apiClient.js # axios/fetch wrapper
│ │ └── endpoints.js # API endpoint definitions
│ │
│ ├── hooks/ # global reusable hooks
│ │ └── useLocalState.js
│ │
│ ├── styles/ # global styles
│ │ ├── globals.css
│ │ └── variables.css
│ │
│ ├── utils/ # helper functions
│ │ └── formatTime.js
│ │
│ └── main.jsx # entry point
│
├── .env # API base URL (IMPORTANT)
├── package.json
└── vite.config.js (or config)
