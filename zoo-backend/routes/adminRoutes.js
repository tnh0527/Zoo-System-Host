import express from "express";
import {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  updateEmployeeSalary,
  getAllLocations,
  updateLocationSupervisor,
  getAllAnimals,
  getAnimalById,
  addAnimal,
  updateAnimal,
  deleteAnimal,
  getRevenueData,
  getStatistics,
  getAllJobTitles,
  getAllEnclosures,
  getAllPurchases,
  getAllTickets,
  getPurchaseItems,
  getPurchaseConcessionItems,
  getAllMemberships,
} from "../controllers/adminController.js";

const router = express.Router();

// Employee routes
router.get("/employees", getAllEmployees);
router.get("/employees/:id", getEmployeeById);
router.post("/employees", addEmployee);
router.put("/employees/:id", updateEmployee);
router.delete("/employees/:id", deleteEmployee);
router.patch("/employees/:id/salary", updateEmployeeSalary);

// Location routes
router.get("/locations", getAllLocations);
router.patch("/locations/:id/supervisor", updateLocationSupervisor);

// Animal routes
router.get("/animals", getAllAnimals);
router.get("/animals/:id", getAnimalById);
router.post("/animals", addAnimal);
router.put("/animals/:id", updateAnimal);
router.delete("/animals/:id", deleteAnimal);

// Analytics routes
router.get("/revenue", getRevenueData);
router.get("/statistics", getStatistics);

// Job titles route
router.get("/job-titles", getAllJobTitles);

// Enclosures route
router.get("/enclosures", getAllEnclosures);

// Purchase & transaction routes
router.get("/purchases", getAllPurchases);
router.get("/tickets", getAllTickets);
router.get("/purchase-items", getPurchaseItems);
router.get("/purchase-concession-items", getPurchaseConcessionItems);
router.get("/memberships", getAllMemberships);

export default router;
