# Checkout Request Contract

This document describes the exact request bodies the current frontend sends from the checkout flow.

## 1) Create Order

**Endpoint**: `POST /api/orders`

The frontend posts this JSON to the local Next.js route, which proxies the same body to the backend order API.

### Request Body

```json
{
  "items": [
    {
      "product": "string",
      "itemType": "product",
      "quantity": 1,
      "size": "string"
    }
  ],
  "delivery": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "zilla": "string",
    "thana": "string",
    "city": "string",
    "district": "string",
    "postCode": "string",
    "note": "string"
  },
  "billing": {
    "sameAsDelivery": true,
    "fullName": "string",
    "email": "string",
    "phone": "string"
  },
  "payment": {
    "method": "COD"
  },
  "promoCode": "string",
  "saveAddress": true,
  "addressLabel": "string"
}
```

### Field Rules

#### `items` [required]

Array of cart line items.

- `product` [required, string]: product or keyring ID
- `itemType` [required, string]: discriminator for backend order processing; allowed values are `product` and `keyring`
- `quantity` [required, number]: quantity greater than or equal to 1
- `size` [optional, string]: included only when the item has a real size value

Current keyring items do not send `size`.

#### `delivery` [required]

Required fields:

- `fullName` [required, string]
- `email` [required, string]
- `phone` [required, string]
- `address` [required, string]
- `zilla` [required, string]
- `thana` [required, string]

Optional fields:

- `city` [optional, string]
- `district` [optional, string]
- `postCode` [optional, string]
- `note` [optional, string]

Empty optional strings are stripped before submit.

#### `billing` [required]

- `sameAsDelivery` [required, boolean]
- `fullName` [optional, string]
- `email` [optional, string]
- `phone` [optional, string]

If `sameAsDelivery` is `true`, the frontend sends only:

```json
{ "sameAsDelivery": true }
```

If `sameAsDelivery` is `false`, the frontend sends the billing contact fields.

#### `payment` [required]

One of:

```json
{ "method": "COD" }
```

or

```json
{
  "method": "Bkash",
  "bkash": {
    "customerPhone": "string",
    "transactionId": "string"
  }
}
```

#### `promoCode` [optional]

String promo code applied from the cart state, included only when present.

#### `saveAddress` [optional]

Boolean flag for persisting the address.

#### `addressLabel` [optional]

Label for the saved address.

### Example Payloads

#### COD Order

```json
{
  "items": [
    {
      "product": "66f1c7a2e3f0a1001a2b3c4d",
      "itemType": "keyring",
      "quantity": 2
    }
  ],
  "delivery": {
    "fullName": "Rahim Uddin",
    "email": "rahim@example.com",
    "phone": "017xxxxxxxx",
    "address": "House 12, Road 3",
    "zilla": "Dhaka",
    "thana": "Badda",
    "note": "Call before delivery"
  },
  "billing": {
    "sameAsDelivery": true
  },
  "payment": {
    "method": "COD"
  },
  "promoCode": "SAVE10"
}
```

#### Bkash Order

```json
{
  "items": [
    {
      "product": "66f1c7a2e3f0a1001a2b3c4d",
      "itemType": "product",
      "quantity": 1
    }
  ],
  "delivery": {
    "fullName": "Rahim Uddin",
    "email": "rahim@example.com",
    "phone": "017xxxxxxxx",
    "address": "House 12, Road 3",
    "zilla": "Dhaka",
    "thana": "Badda"
  },
  "billing": {
    "sameAsDelivery": false,
    "fullName": "Rahim Uddin",
    "email": "rahim.billing@example.com",
    "phone": "018xxxxxxxx"
  },
  "payment": {
    "method": "Bkash",
    "bkash": {
      "customerPhone": "017xxxxxxxx",
      "transactionId": "TRX123456"
    }
  }
}
```

## 2) Apply Promo Code

**Endpoint**: `POST /api/promocodes/apply`

This is sent from the cart store when the user applies a promo code.

### Request Body

```json
{
  "code": "string",
  "subtotal": 0,
  "productIds": ["string"]
}
```

### Field Rules

- `code` [required, string]: promo code entered by the user
- `subtotal` [required, number]: current cart subtotal before discount
- `productIds` [required, string[]]: array of product/keyring IDs currently in cart

## 3) Important Notes

- Keyring personalisation values are currently shown in the UI but are not included in the submitted order payload yet.
- The frontend currently sends cart items only as `{ product, quantity }` for keyrings.
- Optional delivery fields are omitted when empty, not sent as empty strings.
