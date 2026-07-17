# Goal Description

Implement Authentication and a Prode (Predictions) module with a CRUD interface for the "Fever Stats" application. The implementation will use Angular Standalone Components, Firebase (Auth + Firestore), and Tailwind CSS with a premium dark mode design.

## User Review Required

> [!WARNING]
> This plan requires Firebase configuration. I will set up a placeholder configuration, but you will need to replace it with your actual Firebase project configuration to make it work.

## Open Questions

> [!IMPORTANT]
> - Do you already have a Firebase project created? If so, please provide the `firebaseConfig` object (apiKey, authDomain, projectId, etc.) so I can inject it directly into the code. Otherwise, I will use placeholder values.
> - The current `app.ts` is rendering `<app-competition-list>` directly. I will reintroduce `RouterOutlet` so we can navigate between `/`, `/login`, and `/mis-predicciones`. Does that sound good?
> - Where should the "Login" or "Mis Predicciones" link be placed? For now, I will create a simple navigation bar at the top of the app.

## Proposed Changes

### Configuration and Dependencies
- Install `firebase` and `@angular/fire` dependencies.
- Update `app.config.ts` to initialize Firebase App, Auth, and Firestore.

### Routing & Root Component
- Update `app.routes.ts` to define routes:
  - `/` -> `CompetitionListComponent` (Home)
  - `/login` -> `AuthComponent`
  - `/mis-predicciones` -> `ProdeComponent` (Protected by `authGuard`)
- Update `app.ts` and `app.html` to include a `RouterOutlet` and a basic Navigation bar for easy routing between sections.

### Authentication Module
- Create `AuthService` (`src/app/services/auth.service.ts`) to handle login, register, and logout logic with `firebase/auth`.
- Create `AuthComponent` (`src/app/components/auth/auth.component.ts`) with a dark premium UI (bg-zinc-950, indigo-500 accents) allowing users to log in or register.
- Create `authGuard` (`src/app/guards/auth.guard.ts`) to restrict access to `/mis-predicciones`.

### Prode Module (Firestore CRUD)
- Create `PredictionService` (`src/app/services/prediction.service.ts`) to encapsulate Firestore interactions (Create, Read, Update, Delete) for predictions using `firebase/firestore`.
- Create `ProdeComponent` (`src/app/components/prode/prode.component.ts`) to render a beautiful list of the user's predictions, alongside a form to add/edit predictions (Local Team vs Away Team + Result).

## Verification Plan

### Automated Tests
- No automated tests will be written unless specifically requested.

### Manual Verification
- We will manually test the Auth flow (Registration and Login).
- We will verify that unauthorized users cannot access `/mis-predicciones`.
- We will test the CRUD functionality for predictions (Creating a prediction, seeing it in the list, updating the score, and deleting it).
