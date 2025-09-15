const ItemSold = require("../../Models/ItemSold");

paymentCounter = 1;

const jwt = require("jsonwebtoken");
const User = require("../../Models/User");
const Shipping = require("../../Models/Shipping");
const Order = require("../../Models/Order");
const OrderItem = require("../../Models/OrderItem");
const sequelize = require("../../config/Database");

// Fetch shipping info of registered user if exists
exports.fetchShippingInfo = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No Token Found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "User does not exist or is invalid" });
    }

    const userShipping = await Shipping.findOne({ where: { userId } });

    if (userShipping) {
      return res.json({ hasShipping: true, shipping: userShipping });
    } else {
      return res.json({ hasShipping: false });
    }
  } catch (error) {
    console.error("Error trying to verify shipping info:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// To verify user's shipping and payment info before processing payment
exports.verify = async (req, res) => {
  try {
    console.log("🧾 Incoming checkout payload:", req.body);

    const {
      total,
      guest,
      address,
      city,
      prov,
      country,
      postalCode,
      num,
      cardNum,
      cardName,
      cardExp,
      cvv,
      cartData,
    } = req.body;

    // Validate required fields
    if (
      !total ||
      !address ||
      !city ||
      !prov ||
      !country ||
      !postalCode ||
      !cardNum ||
      !cardName ||
      !cardExp ||
      !cvv ||
      !cartData
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!Array.isArray(cartData) || cartData.length === 0) {
      return res.status(400).json({ error: "Invalid or empty cart data" });
    }

    if (String(cardNum).length !== 16 || isNaN(cardNum)) {
      return res
        .status(401)
        .json({ error: "Card Number must be a 16-digit Integer" });
    } else if (!/^[a-zA-Z\s-]{2,50}$/.test(cardName)) {
      return res.status(401).json({ error: "Must be a valid Name on Card" });
    } else if (!verifyCardExp(cardExp).flag) {
      return res.status(401).json({ error: verifyCardExp(cardExp).error });
    } else if (cvv.length !== 3 || isNaN(cvv)) {
      return res
        .status(401)
        .json({ error: "CVV on Credit Card must be a 3-digit Integer" });
    } else if (paymentCounter === 3) {
      paymentCounter = 1;
      return res
        .status(401)
        .json({ error: "Credit Card Authorization Failed." });
    }

    let order;
    let shippingInfo;

    if (guest !== true) {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.id) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res
          .status(401)
          .json({ error: "User does not exist or is invalid" });
      }

      // Fetch existing shipping info for the user. If found, update it with the new information.
      shippingInfo = await Shipping.findOne({ where: { userId: user.id } });
      if (shippingInfo) {
        shippingInfo.street = address;
        shippingInfo.city = city;
        shippingInfo.province = prov;
        shippingInfo.country = country;
        shippingInfo.zip = postalCode;
        shippingInfo.phoneNum = num;
        await shippingInfo.save();
      } else {
        // Create new shipping info if one doesn't already exist.
        shippingInfo = await Shipping.create({
          street: address,
          zip: postalCode,
          city,
          province: prov,
          country,
          phoneNum: num,
          userId: user.id,
        });
      }

      // Create the order using the (updated) shipping information.
      order = await Order.create({
        fName: user.fName,
        lName: user.lName,
        totalPrice: total,
        userId: user.id,
        shippingId: shippingInfo.sid,
      });

      await Promise.all(
        cartData.map(async (item) => {
          await OrderItem.create({
            price: item.price,
            productName: item.name,
            quantity: item.quantity,
            orderId: order.id,
            vehicleId: item.vid || item.vehicleId,
          });

          await ItemSold.create({
            vehicleId: item.vid || item.vehicleId,
            saleDate: new Date(),
            quantitySold: item.quantity,
            priceAtSale: item.price,
          });

          const ipRes = await fetch("https://api.ipify.org?format=json");
          const ipData = await ipRes.json();
          const userIp = ipData.ip || "unknown";

          await sequelize.query(
            "INSERT INTO VisitEvent (ipaddress, day, vid, eventtype) VALUES (?, ?, ?, ?)",
            {
              replacements: [
                userIp,
                getTodayDate(),
                item.vid || item.vehicleId,
                "PURCHASE",
              ],
              type: sequelize.QueryTypes.INSERT,
            }
          );
        })
      );
    } else {
      // Guest flow: create a shipping record and order as before.
      const guestUser = await User.findOne({ where: { id: 1 } });
      if (!guestUser) {
        console.log("🚨 Guest user not found");
        return res.status(500).json({ error: "Guest user not found in DB" });
      }

      shippingInfo = await Shipping.create({
        street: address,
        zip: postalCode,
        city,
        province: prov,
        country,
        phoneNum: num,
        userId: guestUser.id,
      });

      order = await Order.create({
        fName: guestUser.fName,
        lName: guestUser.lName,
        totalPrice: total,
        userId: guestUser.id,
        shippingId: shippingInfo.sid,
      });

      await Promise.all(
        cartData.map(async (item) => {
          await OrderItem.create({
            price: item.price,
            productName: item.name,
            quantity: item.quantity,
            orderId: order.id,
            vehicleId: item.vid || item.vehicleId,
          });

          await ItemSold.create({
            vehicleId: item.vid || item.vehicleId,
            saleDate: new Date(),
            quantitySold: item.quantity,
            priceAtSale: item.price,
          });

          const ipRes = await fetch("https://api.ipify.org?format=json");
          const ipData = await ipRes.json();
          const userIp = ipData.ip || "unknown";

          // Step 2: Log PURCHASE event
          await sequelize.query(
            "INSERT INTO VisitEvent (ipaddress, day, vid, eventtype) VALUES (?, ?, ?, ?)",
            {
              replacements: [
                userIp,
                getTodayDate(),
                item.vid || item.vehicleId,
                "PURCHASE",
              ],
              type: sequelize.QueryTypes.INSERT,
            }
          );
        })
      );
    }

    paymentCounter++;
    res
      .status(200)
      .json({ message: "Shipping and Payment Verified Successfully!", order });
  } catch (error) {
    console.error("❌ Error processing payment:", error);
    res.status(500).json({ error: error.message });
  }
};
function getTodayDate() {
  const today = new Date();
  return `${String(today.getMonth() + 1).padStart(2, "0")}${String(
    today.getDate()
  ).padStart(2, "0")}${today.getFullYear()}`;
}

// Validate credit card expiry date
function verifyCardExp(cardExp) {
  const [cardMonth, cardYear] = cardExp.split("/").map(Number);

  if (isNaN(cardMonth) || isNaN(cardYear)) {
    return {
      flag: false,
      error: "Card expiry date is invalid. Please use MM/YY format.",
    };
  }

  const currDate = new Date();
  const currYear = currDate.getFullYear() % 100;
  const currMonth = currDate.getMonth() + 1;

  if (cardYear < currYear || (cardYear === currYear && cardMonth < currMonth)) {
    return { flag: false, error: "Credit card expiry date has passed." };
  }

  if (cardMonth < 1 || cardMonth > 12) {
    return {
      flag: false,
      error:
        "Credit card expiry month is invalid. It must be between 01 and 12.",
    };
  }

  return { flag: true };
}
