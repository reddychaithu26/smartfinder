# 🔍 SmartFinder – Campus Lost & Found Tracking System

A web technology based Lost & Found portal built using Node.js, Express.js, EJS, HTML, CSS, JavaScript, and lowdb (JSON database) for reporting and recovering misplaced student belongings.

---

## 📁 Project Structure

```
smartfinder/
├── server.js                  ← Main Express app entry point
├── db.js                      ← Database layer (lowdb JSON file)
├── package.json
├── data/
│   └── db.json                ← Auto-created JSON database file
├── uploads/                   ← Uploaded item photos
├── middleware/
│   └── auth.js                ← Login guard middleware
├── routes/
│   ├── auth.js                ← Sign up / Sign in / Logout
│   ├── items.js               ← Item CRUD + Raise concern
│   ├── helpers.js             ← Helpers list
│   └── claims.js              ← Item claims + Claimers list
├── views/                     ← EJS HTML templates (separate pages)
│   ├── partials/
│   │   ├── header.ejs         ← Nav bar + <head>
│   │   └── footer.ejs         ← Footer + JS includes
│   ├── home.ejs
│   ├── signup.ejs
│   ├── signin.ejs
│   ├── my-items.ejs
│   ├── all-items.ejs
│   ├── lost.ejs
│   ├── found.ejs
│   ├── raise.ejs
│   ├── helpers.ejs
│   ├── claimers.ejs
│   └── 404.ejs
└── public/
    ├── css/
    │   └── style.css          ← All styles
    └── js/
        └── main.js            ← Client-side JavaScript
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js v16 or higher
- npm

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open your browser
http://localhost:3000
```

---

## 🔐 Demo Account

| Field    | Value         |
|----------|---------------|
| Roll No  | 23881A05GM    |
| Password | demo123       |

You can also create a new account via Sign Up.

---

## ✨ Features

| Page            | Route             | Description                        |
|-----------------|-------------------|------------------------------------|
| Home            | `/`               | Landing page / Dashboard           |
| Sign Up         | `/signup`         | Register new account               |
| Sign In         | `/signin`         | Login with roll number             |
| My Items        | `/items/my`       | View your reported items           |
| All Items       | `/items/all`      | Browse all items with filters      |
| Lost Items      | `/items/lost`     | View all lost items                |
| Found Items     | `/items/found`    | View all found items + Claim       |
| Raise Concern   | `/items/raise`    | Report a lost or found item        |
| Helpers         | `/helpers`        | List of people who helped          |
| Claimers        | `/claimers`       | List of people who claimed items   |
| Logout          | `/logout`         | End session                        |

---

## 🛠️ Tech Stack

| Layer      | Technology                     |
|------------|--------------------------------|
| Backend    | Node.js, Express.js            |
| Templates  | EJS (Embedded JavaScript)      |
| Database   | lowdb (JSON file database)     |
| Auth       | bcryptjs + express-session     |
| File Upload| multer                         |
| Frontend   | Vanilla JS, CSS3               |
| Fonts      | Google Fonts (Sora, DM Sans)   |

---

## 📌 Notes

- The `data/db.json` file is auto-created on first run with seed data.
- Uploaded images are saved to the `uploads/` folder.
- To reset the database, simply delete `data/db.json` and restart.
