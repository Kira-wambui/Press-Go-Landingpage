import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

// Create Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Needed for ES module path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve frontend (optional)
app.use(express.static(path.join(__dirname, "../frontend")));

// Contact endpoint
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  console.log("New Contact Form Submission:", { name, email, message });

  // TODO: Save to DB or send email

  res.json({ success: true, message: "Message received successfully!" });
});

// Services endpoint
app.get("/services", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Laundry Pickup",
      description: "We pick up laundry at your convenience."
    },
    {
      id: 2,
      name: "Eco-Clean Wash",
      description: "Eco-friendly detergent and washing methods."
    },
    {
      id: 3,
      name: "Express Delivery",
      description: "Get your fresh clothes delivered fast and on time."
    }
  ]);
});

// Start server
app.listen(PORT, () => {
  console.log(`Press & Go backend running on port ${PORT}`);
});

// Sample laundry marts data
const laundryMarts = [
    { name: "Clean & Fresh Laundry", lat: -1.2921, lng: 36.8219, price: "Ksh 500 per load", offers: "10% off on first order" },
    { name: "Sparkle Laundry Services", lat: -1.2950, lng: 36.8200, price: "Ksh 450 per load", offers: "Free pickup this week" },
    { name: "Eco Laundry Mart", lat: -1.2900, lng: 36.8230, price: "Ksh 480 per load", offers: "5% off eco-friendly wash" }
  ];
  
  // Simple distance calculation (Haversine formula)
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI/180;
    const dLon = (lon2 - lon1) * Math.PI/180;
    const a = 
      0.5 - Math.cos(dLat)/2 + 
      Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * 
      (1 - Math.cos(dLon))/2;
    return R * 2 * Math.asin(Math.sqrt(a));
  }
  
  // Nearby laundries endpoint
  app.get("/nearby", (req, res) => {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
  
    if(isNaN(lat) || isNaN(lng)) return res.status(400).json([]);
  
    const nearby = laundryMarts
      .map(mart => ({ ...mart, distance: getDistance(lat, lng, mart.lat, mart.lng) }))
      .filter(mart => mart.distance <= 5) // 5km radius
      .sort((a,b) => a.distance - b.distance);
  
    res.json(nearby);
  });
  