# Customer Rewards Dashboard

## Overview

This application calculates and displays customer reward points based on their transaction history.

It provides a dashboard with:

- **Transactions Table**
- **Monthly Rewards Summary**
- **Total Rewards per Customer**

---

## Features

- Fetch and display customer transactions
- Calculate reward points based on business rules
- Search, sort, and paginate table data
- View monthly reward breakdown
- View total reward points per customer
- Reusable and scalable table component
- Centralized logging system
- Error handling and loading states
- Unit test coverage using Jest

---

## Demo

![Demo](src/assets/demo.gif)

## Project Structure

```
src
│
├ assets
│   └ demo.gif
│   └ test-results.png
│
├ components
│   └ common
│       ├ Card
│       ├ ErrorBoundary
│       ├ ErrorMessage
│       ├ Loader
│       └ Table
│
├ constants
│   └ constants.js
│
├ hooks
│   ├ useDebounce.js
│   └ useFetch.js
│
├ services
│   └ api.js
│
├ styles
│   └ global.css
│
├ utils
│   ├ rewardsService.js
│   ├ tableUtils.js
│   └ logger.js
│
├ __tests__
│   ├ App.test.js
│   ├ Table.test.js
│   ├ rewardsServices.test.js
│   ├ tableUtils.test.js
│   └ useFetch.test.js
│
├ App.js
└ index.js
```

---

## Setup Instructions

### 1. Install dependencies

```
npm install
```

### 2. Start the application

```
npm run start
```

---

## API

The app uses a mock API from public folder (http://localhost/mock-data.json)

---

## Running Tests

Run unit tests using Jest:

```
npm run test
```

### Test Coverage Includes:

- Reward calculation logic
- Monthly reward aggregation
- Total reward calculation
- Sorting logic
- Filtering logic
- Pagination logic

---

## Test Results

![Test Results](src/assets/test-results.png)

## Author

Manohar Shinde

---
