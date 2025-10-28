import express from "express";
import {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  changeCustomerPassword,
} from "../controllers/authController.js";

const router = express.Router();

// Authentication routes
router.post("/register", registerCustomer);
router.post("/login", loginCustomer);

// Customer profile routes
router.get("/profile/:customerId", getCustomerProfile);
router.put("/profile/:customerId", updateCustomerProfile);
router.put("/profile/:customerId/password", changeCustomerPassword);

export default router;
