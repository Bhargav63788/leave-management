const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Schema
const leaveSchema = new mongoose.Schema({
    name: String,
    usn: String,
    fromDate: String,
    toDate: String,
    reason: String,
    status: {
        type: String,
        default: "Pending"
    }
});

const Leave = mongoose.model("Leave", leaveSchema);

// Routes
app.get("/", (req, res) => {
    res.send("Backend is running ✅");
});

app.post("/submit-leave", async (req, res) => {
    try {
        const newLeave = new Leave(req.body);
        await newLeave.save();
        res.send("Saved!");
    } catch (error) {
        console.error("Submit Error:", error);
        res.status(500).send("Error");
    }
});

app.get("/get-leaves", async (req, res) => {
    try {
        const data = await Leave.find().sort({ _id: -1 });
        res.json(data);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).send("Error fetching leaves");
    }
});

app.post("/update-status", async (req, res) => {
    try {
        const { id, status } = req.body;
        await Leave.findByIdAndUpdate(id, { status });
        res.send("Updated");
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).send("Error updating");
    }
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "admin123") {
        res.json({ success: true, token: "secure123" });
    } else {
        res.json({ success: false, message: "Invalid credentials" });
    }
});

// Start server
async function startServer() {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL is missing");
        }

        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB Connected ✅");

        app.listen(PORT, () => {
            console.log("Server running on " + PORT);
        });

    } catch (err) {
        console.error("Startup Error ❌:", err.message);
        process.exit(1);
    }
}

startServer();