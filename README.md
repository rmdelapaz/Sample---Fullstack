# Windbnb (Airbnb Clone)

📍 **Live Site**: [https://windbnb-fullstack.onrender.com/](https://windbnb-fullstack.onrender.com/)  
💻 **GitHub**: [https://github.com/mina-y-khalil/Windbnb---Fullstack](https://github.com/mina-y-khalil/Windbnb---Fullstack)

---

## 🛠 Technologies Used

- JavaScript
- React & Redux
- Express.js
- Sequelize & PostgreSQL
- HTML5 & CSS3 (No CSS frameworks used)
- FontAwesome Icons & Google Fonts

---

## ⚙️ Setup Instructions

1. **Clone the repo**

   ```bash
   git clone https://github.com/mina-y-khalil/Windbnb---Fullstack
   ```

2. **Install dependencies**  
   Run `npm install` in both the `/frontend` and `/backend` directories.

3. **Set up your environment**  
   In `/backend`, create a `.env` file using `.env.example` as reference.

4. **Migrate & seed the database**

   ```bash
   npx dotenv sequelize db:migrate
   npx dotenv sequelize db:seed:all
   ```

5. **Run the application**
   ```bash
   cd backend
   npm start
   # In a separate terminal
   cd frontend
   npm run dev
   ```

---

## ✨ Features

### 📷 Landing Page

> > _(![Insert Screenshot URL here](https://redeem-innovations.com/wp-content/uploads/2025/03/Landing-Page.jpg))_  

> The homepage displays all available spots with dynamic star ratings, image previews, and prices.

---

### 📷 Create a Spot

> _(![Insert Screenshot URL here](https://redeem-innovations.com/wp-content/uploads/2025/03/create-a-new-spot.jpg))_  
> Logged-in users can click "creat a new spot" to fill out a multi-section form and create a new spot listing.

---

### 📷 Manage Spots

> _(![Insert Screenshot URL here](https://redeem-innovations.com/wp-content/uploads/2025/03/manage-spots.jpg))_  
> Users can manage (update/delete) their spots from the “Manage Spots” dashboard, with updates reflected in real-time.

---

### 📷 Spot Detail Page

> Clicking a spot opens a detailed page including full description, host info, images, rating, and reviews.

---

### 📷 Reviews Section

> _(![Insert Screenshot URL here](https://redeem-innovations.com/wp-content/uploads/2025/03/reviews.jpg))_  
> Users can:

- Submit one review per spot
- Delete their review
- View overall rating and total review count  
  (⭐ Update functionality coming soon)

---

## 🧠 Future Enhancements

- [ ] Add update/edit functionality for reviews
- [ ] Add bookings feature with calendar UI

---

## 🙌 Acknowledgments

This project is a solo clone of Airbnb built during App Academy’s Full-Stack Web Development bootcamp.

---

_Last updated: March 23, 2025_
