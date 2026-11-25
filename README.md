# Mini Event

Mini Event is a Next.js event catalogue and booking frontend. It uses the App
Router, TypeScript, Tailwind CSS, DaisyUI, native `fetch`, Better Auth, Zustand,
and Zod.

The backend is a separate service. This repository does not contain backend
source code, database migrations, or seed data; it consumes the backend API
described below.

## Prerequisites

- Node.js 20 or newer and npm
- A running Mini Event backend API
- The backend database configured and migrated by the backend project

## Frontend setup

From this repository root:

```bash
npm install
```

Create `.env.local` manually (there is currently no committed `.env.example`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

`NEXT_PUBLIC_API_URL` must be the API root, including any `/api` prefix. The
frontend sends credentials with requests, so the backend must allow the
frontend origin in its CORS policy and allow credentials.

Start the development server:

```bash
npm run dev
```

Open <http://localhost:3000>. For a production build:

```bash
npm run build
npm start
```

## Backend setup

The backend must be set up from its own repository or project. The exact
database provider, connection string name, migration command, seed command,
and admin-user creation process are backend-specific and are not present in
this frontend repository.

Use this sequence in the backend project:

1. Install the backend runtime and restore its dependencies.
2. Configure the database connection string and authentication settings.
3. Apply the backend database migrations.
4. Seed the database data from the backend project:

```bash
npm run seed
```

5. Start the API on the URL used by `NEXT_PUBLIC_API_URL`.
6. Verify that `GET /events` returns an array before opening the frontend.

Use the install, migration, seed, and start commands supplied by the backend
project. The frontend does not run backend migrations or create database
tables.

## Application routes

### Public routes

- `/` lists events and supports loading, empty, error, search, capacity, and
  full-event states.
- `/events/:id` shows event details and allows a signed-in user to register.
- `/login` signs in or creates an account through Better Auth.
- `/registrations` lists the signed-in user's registrations.

### Admin routes

Admin pages are protected by the authenticated user's admin role:

- `/admin` shows dashboard totals.
- `/admin/events` lists events.
- `/admin/events/create` creates an event.
- `/admin/events/:id` edits or deletes an event.
- `/admin/registrations` lists and cancels registrations.

## API contract

All API paths are relative to `NEXT_PUBLIC_API_URL`. Requests include
`credentials: "include"` and expect JSON unless the response is `204 No
Content`.

### Authentication

Better Auth is expected under `/auth`:

- `POST /auth/sign-in/email`
- `POST /auth/sign-up/email`

The backend should issue the session cookie used by subsequent requests.

### Public and user endpoints

| Method   | Path                        | Expected response                               |
| -------- | --------------------------- | ----------------------------------------------- |
| `GET`    | `/events`                   | Event array                                     |
| `GET`    | `/events/:id`               | One event                                       |
| `POST`   | `/events/:id/registrations` | Optional `{ message }` object or empty response |
| `GET`    | `/registrations`            | Current user's registration array               |
| `DELETE` | `/events/:id/registrations` | Optional `{ message }` object or empty response |

### Admin endpoints

| Method   | Path                                       | Expected response                                                     |
| -------- | ------------------------------------------ | --------------------------------------------------------------------- |
| `GET`    | `/admin/dashboard`                         | `{ totalEvents, confirmedRegistrations, totalUsers, upcomingEvents }` |
| `GET`    | `/admin/events?page=1&pageSize=100`        | `{ items: AdminEvent[] }`                                             |
| `GET`    | `/admin/events/:id`                        | One `AdminEvent`                                                      |
| `POST`   | `/admin/events`                            | Created `AdminEvent`                                                  |
| `PUT`    | `/admin/events/:id`                        | Updated `AdminEvent`                                                  |
| `DELETE` | `/admin/events/:id`                        | Empty response or `204`                                               |
| `GET`    | `/admin/registrations?page=1&pageSize=100` | `{ items: AdminRegistration[] }`                                      |
| `DELETE` | `/admin/registrations/:id`                 | Empty response or `204`                                               |

Public event responses use `id`, `title`, `eventDate`, optional `description`,
`availableSlots`, and optional `maxAttendees`. The frontend maps `eventDate` to
the display field `date`. IDs may be strings or numbers on the wire, but are
normalized to strings in the frontend.

Successful wrapped responses are also supported when the backend returns
`{ success: true, data: ... }` or `{ success: true, message: ... }`. Error
responses should provide a string `message` or `error` field so it can be
shown to the user.

## Database structure

The physical schema belongs to the backend, but the API represents these
logical entities:

### Users

Managed by Better Auth. A user has an identity (including name and unique
email), credentials or an external auth record, a session, and an authorization
role. Admin routes require the admin role.

### Events

An event contains an identifier, title, optional description, event date, and
positive maximum capacity. `registeredCount` and `availableSlots` are derived
from active registrations and should not be treated as independently editable
values. The API also exposes a status: `UPCOMING`, `FULL`, or `PAST`.

### Registrations

A registration joins one user to one event and stores its identifier,
registration timestamp, and status (`CONFIRMED` or `CANCELLED`). The database
should enforce one active registration per user and event, prevent confirmed
registrations from exceeding event capacity, and use foreign keys to both the
user and event records. Cancelled registrations remain useful for history but
must not consume an available slot.

In relational terms, the main relationships are:

```text
User 1 ───< Registration >─── 1 Event
```

The backend should calculate availability consistently, ideally in a
transaction when creating or cancelling a registration, to avoid overbooking
under concurrent requests.

## Validation logic

Validation occurs at both boundaries. The frontend validates form input for
early feedback and validates every API response with Zod. Backend validation
is still authoritative and must repeat the business rules before writing to
the database.

- **Sign in:** trimmed email must be valid; password must contain at least 8
  characters.
- **Sign up:** sign-in rules plus a trimmed name between 1 and 120 characters.
- **Create/update event:** title is required after trimming; description is
  optional; `eventDate` must be parseable as a date; `maxAttendees` is coerced
  to an integer of at least 1.
- **Public event responses:** IDs are string-or-number values; titles and dates
  are non-empty strings; availability is a non-negative integer; capacity, when
  present, is positive.
- **Admin event responses:** counts are non-negative integers and status must
  be `UPCOMING`, `FULL`, or `PAST`.
- **Registration responses:** the optional message must be a string. User
  registration email values must be valid email addresses, and registration
  status must be confirmed or cancelled.

Client-side failures are displayed beside the relevant form or as an error
state. Invalid response data throws a Zod error rather than silently rendering
an incompatible backend response. The schemas and endpoint adapters live in
`src/lib/schemas` and `src/lib/api`.

## Checks

```bash
npm run lint
npm run build
```
