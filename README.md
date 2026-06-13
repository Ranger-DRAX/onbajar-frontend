# OnBazar Frontend

A modern e-commerce storefront for **OnBazar** — built with Next.js, React 19, TypeScript, Tailwind CSS v4, Zustand, and SWR.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| State Management | [Zustand 5](https://zustand-demo.pmnd.rs/) |
| Data Fetching | [SWR 2](https://swr.vercel.app/) |
| Animations | [Framer Motion 12](https://www.framer.com/motion/) |
| Carousel / Slider | [Swiper 12](https://swiperjs.com/) |
| Linting / Formatting | ESLint 9, Prettier 3 |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm / yarn / pnpm / bun

### Install dependencies

```bash
npm install
```

### Set up environment variables

Create a `.env.local` file in the project root (already present). It must contain your backend API base URL:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other scripts

| Script | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

---

## Project Structure

```
src/
├── app/
│   ├── (shop)/                    # Route group — storefront pages
│   │   ├── page.tsx               # Home page  →  /
│   │   ├── layout.tsx             # Shop layout (Navbar + Footer)
│   │   ├── products/
│   │   │   ├── page.tsx           # Product listing  →  /products
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Product detail   →  /products/[id]
│   │   ├── keyrings/
│   │   │   ├── page.tsx           # Keyring listing  →  /keyrings
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Keyring detail   →  /keyrings/[id]
│   │   └── order-success/         # Post-checkout success page
│   ├── checkout/
│   │   └── page.tsx               # Checkout  →  /checkout
│   ├── api/
│   │   └── orders/                # Next.js API route — proxies to backend
│   ├── globals.css
│   └── layout.tsx                 # Root layout
│
├── components/
│   ├── layout/                    # Navbar, Footer
│   ├── home/                      # Hero, featured sections
│   ├── products/                  # ProductCard, ProductGrid, SizeSelector, QuantityControl, Gallery
│   ├── keyrings/                  # Keyring-specific components
│   ├── checkout/                  # CheckoutForm, OrderSummary, PromoCode
│   └── ui/                        # Button, Input, Select, Accordion — shared primitives
│
├── lib/
│   ├── api/                       # Fetch helpers (products, keyrings, orders)
│   ├── swr/                       # SWR hooks
│   └── locations/                 # BD location data (zilla / thana)
│       └── trie.ts                # Trie-based location autocomplete
│
├── providers/                     # React context providers
├── store/
│   └── cart.store.ts              # Zustand cart store (persisted to localStorage)
├── types/
│   ├── product.ts
│   ├── keyring.ts
│   ├── cart.ts
│   ├── order.ts
│   └── addon.ts
└── assets/                        # Static assets (images, icons, etc.)
```

---

## Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, featured products, new arrivals |
| `/products` | Product Listing | Browsable product grid with sort & filter |
| `/products/[id]` | Product Detail | Gallery, size selector, add to cart |
| `/keyrings` | Keyring Listing | Keyring product grid |
| `/keyrings/[id]` | Keyring Detail | Keyring details, personalisation UI, add to cart |
| `/checkout` | Checkout | Delivery info, billing, payment, order summary |
| `/order-success` | Order Success | Confirmation page post-order |

---

## Cart State (Zustand)

The cart is managed globally via `src/store/cart.store.ts` and persisted to `localStorage`.

**Capabilities:**
- Add product or keyring item (with size if required)
- Remove item
- Change quantity
- Apply / remove promo code
- Calculate subtotal, discount, and total
- Expose cart item count for the Navbar badge

---

## API Integration

### Backend Proxy — `/api/orders`

The Next.js API route at `src/app/api/orders/` proxies order creation requests to the backend to keep API credentials server-side.

For full request / response contracts, see **[CHECKOUT_REQUEST_CONTRACT.md](./CHECKOUT_REQUEST_CONTRACT.md)**.

### Key Endpoints (consumed via SWR / fetch)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Paginated product list |
| `GET` | `/api/products/:id` | Single product detail |
| `GET` | `/api/keyrings` | Paginated keyring list |
| `GET` | `/api/keyrings/:id` | Single keyring detail |
| `POST` | `/api/orders` | Create order |
| `POST` | `/api/promocodes/apply` | Validate & apply promo code |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | ✅ | Base URL of the backend REST API |

---

## Contributing

1. Fork the repo and create a feature branch: `git checkout -b feature/your-feature`
2. Follow the existing code style (Prettier config in `.prettierrc`)
3. Run lint before pushing: `npm run lint`
4. Open a pull request with a clear description

---

## License

Private repository — © OnBazar. All rights reserved.
