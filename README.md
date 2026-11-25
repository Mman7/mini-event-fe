# Mini Event

Frontend for a mini event booking system built with Next.js App Router, TypeScript, Tailwind CSS, DaisyUI, native Fetch, and Zod.

## Setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL` to the backend API root, for example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Routes

- `/` lists events with loading, empty, error, search, capacity, and full-event states.
- `/events/:id` shows event details and the registration form.

## API contract

The frontend calls:

- `GET /events`
- `GET /events/:id`
- `POST /events/:id/registrations`

Event responses are currently expected to use the fields `id`, `title`, `date`, `description`, `availableSlots`, and optional `maxAttendees`. The list response is an array and the detail response is one event object. Registration accepts a JSON object response, an empty response, or a response containing an optional `message` field.

Update the schemas and endpoint adapters under `src/lib/` if the backend uses a different documented response envelope.

## Themes

The app uses DaisyUI's `corporate` and `night` themes. The selected theme is persisted in browser storage and applies across the application.

## Checks

```bash
npm run lint
npm run build
```
