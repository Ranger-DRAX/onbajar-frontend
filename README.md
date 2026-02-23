This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



```
src/
  app/
    (shop)/
      page.tsx                  # Home
      products/
        page.tsx                # Product listing
        [id]/
          page.tsx              # Product details
      checkout/
        page.tsx                # Checkout
    layout.tsx                  # Root layout (Navbar/Footer wrapper)
    globals.css
    not-found.tsx               # Optional

  components/
    layout/
      Navbar.tsx
      Footer.tsx
    products/
      ProductCard.tsx
      ProductGrid.tsx
      SizeSelector.tsx
      QuantityControl.tsx
    ui/
      Button.tsx
      Input.tsx
      Select.tsx
      Accordion.tsx             # Optional

  data/
    products.ts                 # Dummy data (temporary)

  lib/
    api/
      products.ts               # getProducts(), getProductById()
      orders.ts                 # createOrder() later
    utils/
      cn.ts                     # Optional className helper

  store/
    cart.store.ts               # Cart state (Context/Zustand)

  types/
    product.ts
    cart.ts
    order.ts
    ```


```
# Build Product Listing UI properly ( biggest reusable page)
Route: /products → src/app/(shop)/products/page.tsx
Create these components:

components/products/ProductCard.tsx
(image, title, price, hover)

components/products/ProductGrid.tsx
(responsive grid)

components/ui/Select.tsx (sort dropdown UI)

components/ui/Button.tsx (reusable button)

Add features gradually (frontend only):

Show product count (meta.total)

Sort UI (even if backend sort not ready yet)

Filter UI (category, price range) — can be UI only first

# This page sets your design system for product cards which you reuse on Home and “Related products”.
```

```
# Product Details page (connect from listing)

Route: /products/[id] → src/app/(shop)/products/[id]/page.tsx

Create components:

components/products/ProductGallery.tsx (main image + thumbnails)

components/products/SizeSelector.tsx (sizes)

components/products/QuantityControl.tsx (+ / -)

components/ui/Accordion.tsx (description / shipping / returns sections)

Important note:  API currently gives list endpoint. For details page  need one of:

/api/products/:id or /api/products/slug/:slug

Until backend provides it, temporarily:

fetch the list and .find(p => p._id === params.id) (works for now)

```

```
# Cart state (frontend responsibility)
Once detail UI exists, enable “Add to cart”.

Where:

src/store/cart.store.ts (Zustand recommended)

Persist to localStorage

Cart should support:

add item (with size if required)

remove

change quantity

totals

cart count for navbar

Then update:

Navbar shows cart count

Checkout uses cart data
```
```
# Checkout page UI

Route: /checkout → src/app/(shop)/checkout/page.tsx

Create components:

components/checkout/CheckoutForm.tsx (delivery info fields)

components/checkout/OrderSummary.tsx (items + subtotal + shipping + total)

components/checkout/PromoCode.tsx (optional)

Reuse QuantityControl

Even if backend order API isn’t ready, you can build:

form UI

validation

summary from cart

```
```
# Home page (build last)

Route: / → src/app/(shop)/page.tsx

Home usually reuses:

ProductGrid for “New Arrivals / Best Sellers”

ProductCard

Hero component

So Home becomes easy after listing UI is done.
```