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
