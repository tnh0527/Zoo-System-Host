import express from "express";
import { upload } from "../middleware/upload.js";
import {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  updateEmployeeSalary,
  getAllLocations,
  updateLocationSupervisor,
  getAllExhibits,
  getExhibitById,
  addExhibit,
  updateExhibit,
  deleteExhibit,
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
  getPricing,
  updatePricing,
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

// Exhibit routes
router.get("/exhibits", getAllExhibits);
router.get("/exhibits/:id", getExhibitById);
router.post("/exhibits", addExhibit);
router.put("/exhibits/:id", updateExhibit);
router.delete("/exhibits/:id", deleteExhibit);

// Animal routes
router.get("/animals", getAllAnimals);
router.get("/animals/:id", getAnimalById);
router.post("/animals", addAnimal);
router.put("/animals/:id", updateAnimal);
router.delete("/animals/:id", deleteAnimal);

// Exhibit image upload route
router.post(
  "/exhibits/:id/upload-image",
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      // Import db connection and deleteImageFile
      const db = (await import("../config/database.js")).default;
      const { deleteImageFile } = await import("../middleware/upload.js");

      // Get current image URL to delete old file
      const [currentExhibit] = await db.query(
        "SELECT Image_URL FROM Exhibit WHERE Exhibit_ID = ?",
        [id]
      );

      // Delete old image file if exists
      if (currentExhibit[0]?.Image_URL) {
        try {
          // Extract filename from URL
          const oldUrl = currentExhibit[0].Image_URL;
          const filename = oldUrl.split("/").pop();
          deleteImageFile("exhibits", filename);
        } catch (err) {
          console.error("Error deleting old image:", err);
          // Continue even if delete fails
        }
      }

      // Construct the new image URL
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/exhibits/${
        req.file.filename
      }`;

      // Update exhibit with new image URL
      await db.query("UPDATE Exhibit SET Image_URL = ? WHERE Exhibit_ID = ?", [
        imageUrl,
        id,
      ]);

      res.json({
        success: true,
        imageUrl: imageUrl,
        filename: req.file.filename,
      });
    } catch (error) {
      console.error("Error uploading exhibit image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  }
);

// Animal image upload route
router.post(
  "/animals/:id/upload-image",
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      // Import db connection and deleteImageFile
      const db = (await import("../config/database.js")).default;
      const { deleteImageFile } = await import("../middleware/upload.js");

      // Get current image URL to delete old file
      const [currentAnimal] = await db.query(
        "SELECT Image_URL FROM Animal WHERE Animal_ID = ?",
        [id]
      );

      // Delete old image file if exists
      if (currentAnimal[0]?.Image_URL) {
        try {
          // Extract filename from URL
          const oldUrl = currentAnimal[0].Image_URL;
          const filename = oldUrl.split("/").pop();
          deleteImageFile("animals", filename);
        } catch (err) {
          console.error("Error deleting old image:", err);
          // Continue even if delete fails
        }
      }

      // Construct the new image URL
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/animals/${
        req.file.filename
      }`;

      // Update animal with new image URL
      await db.query("UPDATE Animal SET Image_URL = ? WHERE Animal_ID = ?", [
        imageUrl,
        id,
      ]);

      res.json({
        success: true,
        imageUrl: imageUrl,
        filename: req.file.filename,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  }
);

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

// Pricing routes
router.get("/pricing", getPricing);
router.patch("/pricing", updatePricing);

export default router;
