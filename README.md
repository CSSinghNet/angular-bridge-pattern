# Angular Polymorphic Wrapper – Signals + Lightweight InjectionToken

Modern, type-safe, and reusable wrapper component that calls common methods (`load()`, `refresh()`) on **any projected child component** without tight coupling.

Built with Angular 18+ / 19+ best practices (2025–2026 style):
- Standalone components
- Signals-only queries (`contentChild`, `computed`)
- Lightweight `InjectionToken` + `useExisting` (tree-shakable)
- No `@ViewChild` decorators
- Hybrid DI + projected fallback for maximum safety

Perfect for dashboards, tabs, cards, wizards, reusable forms, or any container that needs to control polymorphic children.

## Features

- **Polymorphic behavior** — wrapper doesn't know or care which child is projected  
- **Full type safety** — shared `Refreshable` interface  
- **Lightweight DI** — tree-shakable token, no heavy abstract classes  
- **Signals-powered** — reactive bridge selection, no lifecycle hooks needed  
- **Optional + safe** — warns if no child provides the behavior  
- **Easy to extend** — add new child types without touching the wrapper  
- **Test-friendly** — mock the token easily  

## Demo Structure
```text
src/app/shared/
├── refresh.token.ts               # Lightweight token + Refreshable interface
├── wrapper/
│   └── wrapper.component.ts       # The polymorphic container
├── com-one/
│   └── com-one.component.ts          # Example child 1
└── com-two/
└── com-two.component.ts          # Example child 2
```
---
## Design Patterns Used

This implementation primarily follows the **Polymorphic Components** pattern (an Angular-specific flavor of the **Strategy Pattern**), while incorporating key elements of the **Bridge Pattern** for structural decoupling and independent evolution.

### 1. Strategy Pattern (via Polymorphism + Shared Interface)
- **Core Idea**: The wrapper defines a common "strategy" through the `Refreshable` interface (`load()` / `refresh()` methods).  
  Different child components (Com1, Com2, etc.) implement this interface and become interchangeable "strategies".  
  The wrapper executes the appropriate strategy at runtime without knowing the concrete child type.

- **Why it fits**:
  - Behavior (load/refresh logic) varies independently per child.
  - The wrapper selects and delegates to the right strategy dynamically.
  - Highly scalable: Add new child types (new strategies) without modifying the wrapper code.

This is the dominant pattern here — classic Strategy applied to content-projected children.

### 2. Bridge Pattern Elements (Decoupling Abstraction from Implementation)
- **Classical Bridge Pattern** (from GoF): Separates an **abstraction** (high-level interface/API) from its **implementation** (concrete details) so both can vary independently. It favors composition over inheritance to avoid class explosion.

- **How Bridge appears in this setup**:
  - **Abstraction** = The wrapper's public API (the `load()` / `refresh()` methods/buttons) + the `Refreshable` interface/contract.
  - **Implementation** = The concrete child components (Com1, Com2) that provide the actual logic/behavior.
  - **The Bridge** = Lightweight `InjectionToken<Refreshable>` + Dependency Injection (`inject()`) + content projection (`<ng-content>`).
    - The wrapper composes behavior via the token (acting as the bridge) rather than inheriting or hardcoding child types.
    - This allows the wrapper's UI/API (e.g., adding loading spinners, tabs, error states, or multi-child support) to evolve **independently** of child implementations.
    - New child types or even slight changes to the shared interface can be introduced without breaking existing wrappers.

- **Real Angular Parallel**:
  Angular's own **reactive/template-driven forms** use a similar Bridge internally:  
  The forms API (abstraction: `FormControl`, `ngModel`) is decoupled from DOM/native elements via `ControlValueAccessor` (the bridge/implementation).  
  Directives like `ngModel` or `formControl` delegate to different accessors (text input, checkbox, custom components) without knowing details — exactly like our token bridges wrapper to children.

  ### 3. Lightweight InjectionToken Pattern (Angular Official Best Practice)
- **What it is**: Instead of using a heavy abstract class or concrete class directly as a DI token (which can prevent tree-shaking), we use a pure `InjectionToken<T>` — just a lightweight identifier (string description + type) with no runtime implementation attached to the token itself.  
  Concrete classes (children) provide themselves via `{ provide: REFRESH_TOKEN, useExisting: ThisComponent }`.

- **Why we chose this** (from angular.dev/guide/di/lightweight-injection-tokens):
  - **Tree-shakable**: If a child component (e.g., Com3) is never used in the app, its entire code (including the provider) can be removed from the bundle during build (AOT/tree-shaking).
  - **No runtime overhead**: Token is just an object reference — no class instantiation or factory unless needed.
  - **Type-safe & flexible**: `<Refreshable>` keeps strong typing; `useExisting` aliases the child instance without creating extras.
  - **Better than abstract class as token**: Abstract classes stay in the bundle (even if unused) because they have runtime presence. Lightweight token avoids this (official Angular recommendation for libraries/apps wanting optimal bundle size).

- **Strategy vs Bridge Comparison in This Context**:

  | Aspect                  | Strategy Pattern Focus                  | Bridge Pattern Focus                              | In Our Implementation                     |
  |-------------------------|-----------------------------------------|---------------------------------------------------|-------------------------------------------|
  | Primary Goal            | Vary **behavior/algorithm** at runtime | Decouple **abstraction** from **implementation** hierarchies | Mostly Strategy (behavior), Bridge for decoupling |
  | Variation Dimensions    | One (behavior)                          | Two (abstraction + implementation)                | Behavior varies (Strategy); wrapper/children evolve separately (Bridge) |
  | Typical Use             | Algorithms, payments, sorting           | UI shapes/colors, Angular forms (ControlValueAccessor) | Behavior via interface → Strategy; DI token as bridge → Bridge touch |
  | Key Benefit Here        | Interchangeable children                | Independent evolution of wrapper & children       | Both: scalable + maintainable             |

**Bottom line**:  
This is **primarily Strategy Pattern** for polymorphic behavior selection via a shared interface.  
By leveraging `InjectionToken` + DI + content projection, we gain **Bridge Pattern** advantages: full decoupling between the wrapper (abstraction) and children (implementation), enabling both sides to grow independently — a powerful combo for real-world Angular apps like dashboards, tabs, or reusable containers.

## How It Works (Core Pattern)

1. Define a simple behavior interface:
   ```ts
   export interface Refreshable {
     load(): void;
     refresh(): void;
   }
   ```
2. Create a lightweight token:
   ```ts
   export const REFRESH_TOKEN = new InjectionToken<Refreshable>('Refreshable Behavior Token');
    ```

 4. Each child provides itself:TypeScript :
```ts
providers: [{ provide: REFRESH_TOKEN, useExisting: ComOneComponent }]
```
