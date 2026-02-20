# 🎫 Zadanie Rekrutacyjne: Panel Operatora Call Center

Aplikacja webowa do obsługi zgłoszeń klientów w call center, stworzona jako zadanie rekrutacyjne na stanowisko Frontend Developer (Vue.js).

## 🚀 Demo

**Live:** [https://rekrutacjabase.netlify.app](https://rekrutacjabase.netlify.app)

---

### Stack technologiczny:

- **Vue 3.5** (Composition API)
- **Pinia 3.x** - zarządzanie stanem
- **Vue Router 5.x** - routing
- **Sass** - stylowanie (SCSS syntax)
- **Vite** - build tool
- **TypeScript** - type safety

---

## 📦 Instalacja

```bash
# 1. Klonuj repozytorium
git clone https://github.com/andrzejdzirba/rekrutacjabase.git .

# 2. Zainstaluj zależności
npm install

# 3. Utworzenie .env
copy .env.example .env

# 4. Uruchom aplikację w trybie deweloperskim
npm run dev

# 5. Otwórz przeglądarkę
http://localhost:5173
```

### Dostępne komendy:

```bash
npm run dev          # Uruchom dev server
npm run build        # Build produkcyjny
npm run preview      # Podgląd buildu
npm run lint         # Lint check (Oxlint)
npm run format       # Prettier format
npm run test:unit    # Uruchom testy jednostkowe (Store, App, Details View)
```

---

## ✨ Funkcjonalności

### ✅ Zrealizowane wymagania:

- ✓ **Lista zgłoszeń (`/`)**
  - Wyświetlanie tabeli/listy zawierającej: ID, imię i nazwisko klienta, temat, status, priorytet
  - Filtrowanie po statusie (Nowe / W trakcie / Zamknięte / Wszystkie)
  - Klikalność wierszy → przekierowanie do szczegółów
  - Responsywność: tabela (desktop) → karty (mobile)

- ✓ **Szczegóły zgłoszenia (`/ticket/:id`)**
  - Wyświetlanie pełnych informacji: ID, klient, temat, opis, status, priorytet, data utworzenia
  - Możliwość zmiany statusu (select dropdown + przycisk "Zapisz")
  - Przycisk "Powrót do listy"

- ✓ **Store (Pinia)**
  - State: lista zgłoszeń, loading, error
  - Actions: pobieranie zgłoszeń (symulacja API z setTimeout), aktualizacja statusu
  - Getters: filtrowane zgłoszenia według statusu

- ✓ **Stylowanie (Sass)**
  - Zmienne dla kolorów, spacing
  - Zagnieżdżanie
  - Kolory statusów (new: niebieski, in_progress: pomarańczowy, closed: zielony)
  - Podstawowa responsywność (table → karty na mobile)

- ✓ **Dane mockowe**
  - 8-10 zgłoszeń w pliku/store
  - format danych:
    {
    id: 1,
    customerName: "Jan Kowalski",
    subject: "Problem z logowaniem",
    description: "Nie mogę się zalogować do systemu od wczoraj.",
    priority: "high", // low, medium, high
    status: "new", // new, in_progress, closed
    createdAt: "2024-02-06T10:30:00"
    }

---

### 🌟 Dodatkowe zrealizowane funkcjonalności:

- ✓ **Tech**
  - Typescript - deklaracja typów danych
  - Bootstrap do podstawowej responsywności (zaimportowane jedynie używane komponenty)
  - .env definiuje środowisko (mock / production) i ścieżki dla fetch - w trybie mock pobieramy wszystkie dane do store i pracujemy na nich
  - Testy

- ✓ **Funkcjonalności**
  - ✓ **Stronicowanie** - zwiększyłem wymaganą ilość danych żeby pokazać stronicowanie

- ✓ **UX Enhancements**
  - Kolory priorytetów (high: czerwony)
  - Loader
  - Error handling
  - Toast notifications (feedback po zapisie)

- ✓ **Accessibility**
  - Semantic HTML
  - ARIA labels - w menu głównym mobile
  - Keyboard navigation (Tab, Enter, Escape)
  - Focus states
  - Color contrast (WCAG AA)

---

## 🚀 Demo

**Live:** [https://rekrutacjabase.netlify.app](https://rekrutacjabase.netlify.app)
