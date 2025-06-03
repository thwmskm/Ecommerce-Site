// syncItemSold.js

const sequelize = require('./config/Database');  
const ItemSold = require('./Models/ItemSold');  

(async () => {
  try {
    // Only sync the ItemSold model
    await ItemSold.sync({ alter: true });
    console.log("ItemSold table synced successfully!");
  } catch (error) {
    console.error("Error syncing ItemSold table:", error);
  } finally {
    // Close the DB connection so the script can exit
    await sequelize.close();
  }
})();
