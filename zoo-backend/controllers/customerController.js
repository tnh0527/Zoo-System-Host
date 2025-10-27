import db from "../config/database.js";

// ============================================
// EXHIBITS - Customer View
// ============================================

export const getAllExhibits = async (req, res) => {
  try {
    const [exhibits] = await db.query(`
      SELECT 
        e.Exhibit_ID,
        e.exhibit_Name,
        e.exhibit_Description,
        e.Capacity,
        e.Location_ID,
        e.Display_Time,
        l.Location_Description,
        l.Zone as Zone_Name
      FROM Exhibit e
      LEFT JOIN Location l ON e.Location_ID = l.Location_ID
      ORDER BY e.Exhibit_ID
    `);
    res.json(exhibits);
  } catch (error) {
    console.error("Error fetching exhibits:", error);
    console.error("SQL Error details:", error.sqlMessage);
    res
      .status(500)
      .json({ error: "Failed to fetch exhibits", details: error.message });
  }
};

export const getExhibitById = async (req, res) => {
  try {
    const { id } = req.params;
    const [exhibits] = await db.query(
      `
      SELECT 
        e.Exhibit_ID,
        e.exhibit_Name,
        e.exhibit_Description,
        e.Capacity,
        e.Location_ID,
        e.Display_Time,
        l.Location_Description,
        l.Zone as Zone_Name
      FROM Exhibit e
      LEFT JOIN Location l ON e.Location_ID = l.Location_ID
      WHERE e.Exhibit_ID = ?
    `,
      [id]
    );

    if (exhibits.length === 0) {
      return res.status(404).json({ error: "Exhibit not found" });
    }

    res.json(exhibits[0]);
  } catch (error) {
    console.error("Error fetching exhibit:", error);
    res.status(500).json({ error: "Failed to fetch exhibit" });
  }
};

// ============================================
// ACTIVITIES - Customer View
// ============================================

export const getAllActivities = async (req, res) => {
  try {
    const [activities] = await db.query(`
      SELECT 
        ea.Activity_ID,
        ea.Exhibit_ID,
        ea.Activity_Name,
        ea.Activity_Description,
        ea.Activity_Order,
        e.exhibit_Name,
        e.Display_Time,
        l.Zone as Zone_Name
      FROM Exhibit_Activity ea
      LEFT JOIN Exhibit e ON ea.Exhibit_ID = e.Exhibit_ID
      LEFT JOIN Location l ON e.Location_ID = l.Location_ID
      ORDER BY ea.Activity_ID
    `);
    res.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    console.error("SQL Error details:", error.sqlMessage);
    res.status(500).json({ error: "Failed to fetch activities", details: error.message });
  }
};

export const getActivitiesByExhibit = async (req, res) => {
  try {
    const { exhibitId } = req.params;
    const [activities] = await db.query(
      `
      SELECT 
        ea.Activity_ID,
        ea.Exhibit_ID,
        ea.Activity_Name,
        ea.Activity_Description,
        ea.Activity_Order,
        e.exhibit_Name,
        e.Display_Time,
        l.Zone as Zone_Name
      FROM Exhibit_Activity ea
      LEFT JOIN Exhibit e ON ea.Exhibit_ID = e.Exhibit_ID
      LEFT JOIN Location l ON e.Location_ID = l.Location_ID
      WHERE ea.Exhibit_ID = ?
      ORDER BY ea.Activity_Order
    `,
      [exhibitId]
    );
    res.json(activities);
  } catch (error) {
    console.error("Error fetching exhibit activities:", error);
    console.error("SQL Error details:", error.sqlMessage);
    res.status(500).json({ error: "Failed to fetch exhibit activities", details: error.message });
  }
};

// ============================================
// TODAY'S SCHEDULE - Customer View
// ============================================

export const getTodaysSchedule = async (req, res) => {
  try {
    // Calculate which activity order to show based on day of year
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Even days: Activity_Order 1, Odd days: Activity_Order 2
    const activityOrder = dayOfYear % 2 === 0 ? 1 : 2;

    const [schedule] = await db.query(
      `
      SELECT 
        ea.Activity_Name,
        ea.Activity_Description,
        e.exhibit_Name as location,
        e.Display_Time as time,
        l.Zone as Zone_Name
      FROM Exhibit_Activity ea
      JOIN Exhibit e ON ea.Exhibit_ID = e.Exhibit_ID
      LEFT JOIN Location l ON e.Location_ID = l.Location_ID
      WHERE ea.Activity_Order = ?
      ORDER BY e.Display_Time
    `,
      [activityOrder]
    );

    res.json(schedule);
  } catch (error) {
    console.error("Error fetching today's schedule:", error);
    console.error("SQL Error details:", error.sqlMessage);
    res.status(500).json({ error: "Failed to fetch today's schedule", details: error.message });
  }
};

// ============================================
// ANIMALS - Customer View
// ============================================

export const getAllAnimals = async (req, res) => {
  try {
    const [animals] = await db.query(`
      SELECT 
        a.*,
        e.Enclosure_Name,
        e.Enclosure_Type
      FROM Animal a
      LEFT JOIN Enclosure e ON a.Enclosure_ID = e.Enclosure_ID
      ORDER BY a.Animal_Name
    `);
    res.json(animals);
  } catch (error) {
    console.error("Error fetching animals:", error);
    res.status(500).json({ error: "Failed to fetch animals" });
  }
};

// ============================================
// ENCLOSURES - Customer View
// ============================================

export const getAllEnclosures = async (req, res) => {
  try {
    const [enclosures] = await db.query(`
      SELECT 
        Enclosure_ID,
        Enclosure_Name,
        Enclosure_Type
      FROM Enclosure
      ORDER BY Enclosure_Name
    `);
    res.json(enclosures);
  } catch (error) {
    console.error("Error fetching enclosures:", error);
    res.status(500).json({ error: "Failed to fetch enclosures" });
  }
};
