const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const routes = require("./Routes/routes");
const authRoutes = require("./Routes/authRoutes");
const checkoutRoutes = require("./Routes/checkoutRoutes");
const catalogRoutes = require("./Routes/catalogRoutes");
const vehicleRoutes = require("./Routes/vehicleRoutes");
const visitEventRoute = require("./Routes/visitEventRoute.js");
const sequelize = require("./config/Database");
const ItemSold = require("./Models/ItemSold.js");
const adminAnalyticsRoutes = require("./Routes/adminAnalytics");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static(path.join(__dirname, "View")));
// Serve static files from the React frontend
/*app.use(
  express.static(path.join(__dirname, "Frontend/ecommerce-react-frontend/dist"))
);*/

app.use("/events", visitEventRoute);
app.use("/admin/analytics", adminAnalyticsRoutes);

const isAdmin = require("./Routes/isAdmin");
app.get("/admin/analytics", isAdmin, (req, res) => {
  res.sendFile(
    path.join(__dirname, "Deliverable", "View", "adminAnalytics.html")
  );
});

//different routers to use
//app.use("/", routes);
app.use("/checkout", checkoutRoutes);
app.use("/api/catalog", catalogRoutes);

//Authentication route
app.use("/auth", authRoutes);

//finding vehicles route
app.use("/vehicles", vehicleRoutes);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 },
  })
);

app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  //if the user has not logged in, start guest session
  if (!req.session.guest) {
    req.session.guest = true;
    req.session.user = false;
  }
  next();
});

app.get("/api/cart", (req, res) => {
  res.json({
    cart: req.session.cart,
    totalItems: req.session.cart.reduce(
      (total, item) => total + item.quantity,
      0
    ),
    totalPrice: req.session.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ),
  });
});

app.post("/api/cart/add", (req, res) => {
  const {
    vehicleId,
    name,
    price,
    quantity = 1,
    image,
    customizations,
  } = req.body;

  if (!vehicleId || !name || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // If no customizations, the cartItemId will just be the vehicleId
  const cartItemId = customizations
    ? `${vehicleId}_${JSON.stringify(customizations)}`
    : vehicleId;

  const existingItemIndex = req.session.cart.findIndex(
    (item) => item.cartItemId === cartItemId
  );

  if (existingItemIndex > -1) {
    // Item with same ID and customizations exists - just update quantity
    req.session.cart[existingItemIndex].quantity += parseInt(quantity);
  } else {
    // Add as new item with its unique cartItemId
    req.session.cart.push({
      vehicleId,
      cartItemId,
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      image,
      customizations,
    });
  }

  res.json({
    message: "Item added to cart",
    cart: req.session.cart,
    totalItems: req.session.cart.reduce(
      (total, item) => total + item.quantity,
      0
    ),
    totalPrice: req.session.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ),
  });
});

app.put("/api/cart/update/:cartItemId", (req, res) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: "Invalid quantity" });
  }

  const itemIndex = req.session.cart.findIndex(
    (item) => item.cartItemId === cartItemId
  );

  if (itemIndex === -1) {
    return res.status(404).json({ error: "Item not found in cart" });
  }

  req.session.cart[itemIndex].quantity = parseInt(quantity);

  res.json({
    message: "Cart updated",
    cart: req.session.cart,
    totalItems: req.session.cart.reduce(
      (total, item) => total + item.quantity,
      0
    ),
    totalPrice: req.session.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ),
  });
});

app.delete("/api/cart/remove/:cartItemId", (req, res) => {
  const { cartItemId } = req.params;

  req.session.cart = req.session.cart.filter(
    (item) => item.cartItemId !== cartItemId
  );

  res.json({
    message: "Item removed from cart",
    cart: req.session.cart,
    totalItems: req.session.cart.reduce(
      (total, item) => total + item.quantity,
      0
    ),
    totalPrice: req.session.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ),
  });
});

//clear cart
app.delete("/api/cart/clear", (req, res) => {
  req.session.cart = [];

  res.json({
    message: "Cart cleared",
    cart: [],
    totalItems: 0,
    totalPrice: 0,
  });
});

// Fallback for React SPA - serve index.html for unknown routes
/*app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "Frontend/ecommerce-react-frontend/dist/index.html")
  );
});*/

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

/*app.use(
  "/assets",
  express.static(
    path.join(__dirname, "Frontend/ecommerce-react-frontend/dist/assets"),
    {
      setHeaders: (res, path) => {
        if (path.endsWith(".js")) {
          res.set("Content-Type", "application/javascript");
        } else if (path.endsWith(".css")) {
          res.set("Content-Type", "text/css");
        }
      },
    }
  )
);*/

module.exports = app;
