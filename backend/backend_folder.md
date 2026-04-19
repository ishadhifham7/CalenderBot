backend/
│
├── src/
│
│ ├── app.ts
│ ├── server.ts
│
│ ├── modules/
│ │
│ │ ├── ai/
│ │ │ ai.controller.ts
│ │ │ ai.service.ts
│ │ │ gemini.client.ts
│ │ │ prompt.builder.ts
│ │ │ ai.types.ts
│ │
│ │ ├── chat/
│ │ │ chat.controller.ts
│ │ │ chat.service.ts
│ │ │ chat.routes.ts
│ │
│ │ ├── schedule/
│ │ │ schedule.service.ts
│ │ │ schedule.data.ts
│ │ │ schedule.utils.ts
│ │
│ │ ├── intent/
│ │ intent.service.ts
│ │ intent.rules.ts
│
│ ├── shared/
│ │ ├── utils/
│ │ │ time.utils.ts
│ │ │ response.utils.ts
│ │ │
│ │ ├── config/
│ │ env.ts
│
│ ├── types/
│ │ global.types.ts
│
├── .env
├── package.json
└── tsconfig.json
