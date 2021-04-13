// Import Sequelize
import Sequelize from "sequelize";
import InitSchema from "../models/schema_orus_db";
import UserModel from "../models/Orus_db/UserModel";

// Logging
import Logger from "./Logger";
// Properties
import properties from "../properties.js";

class Database {
  constructor() {}

  /**
   * Init database
   */
  async init() {
    await this.authenticate();
    Logger.info(
      "Database connected at: " +
        properties.orus_db.host +
        ":" +
        properties.orus_db.port +
        "//" +
        properties.orus_db.user +
        "@" +
        properties.orus_db.name
    );

    // Import schema
    InitSchema();

    await UserModel.createAdminUser();

  }

  /**
   * Start database connection
   */
  async authenticate() {
    Logger.info("Authenticating to the databases...");

    const sequelize = new Sequelize(
      properties.orus_db.name,
      properties.orus_db.user,
      properties.orus_db.password,
      {
        host: properties.orus_db.host,
        dialect: properties.orus_db.dialect,
        port: properties.orus_db.port,
        logging: false
      }
    );
    this.dbConnection_orus_db = sequelize;

    try {
      await sequelize.sync();
    } catch (err) {
      // Catch error here
      Logger.error(`Failed connection to the DB`);
      Logger.error(err);
      await new Promise(resolve => setTimeout(resolve, 5000));
      await this.authenticate();
    }
  }

  /**
   * Get connection db
   */
  getConnection() {
    return this.dbConnection_orus_db;
  }
}

export default new Database();
