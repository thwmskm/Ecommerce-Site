module.exports = {
  development: {
    username: "caradmin",
    password: "AdminStrongPass2025!",
    database: "carstore",
    host: "carstore-db.cvggumuwm4u3.ca-central-1.rds.amazonaws.com",
    dialect: "mysql"
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: "caradmin",
    password: "AdminStrongPass2025!",
    database: "carstore",
    host: "carstore-db.cvggumuwm4u3.ca-central-1.rds.amazonaws.com",
    dialect: "mysql",
    dialectOptions: {
      ssl: 'Amazon RDS'
    }
  }
};
