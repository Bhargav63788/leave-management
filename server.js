const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

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

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.post("/submit-leave", async (req, res) => {
    try {
        const newLeave = new Leave(req.body);
        await newLeave.save();
        res.send("Saved!");
    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).send("Error");
    }
});

app.get("/get-leaves", async (req, res) => {
    try {
        const data = await Leave.find().sort({ _id: -1 });
        res.json(data);
    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).send("Error");
    }
});

app.post("/update-status", async (req, res) => {
    try {
        const { id, status } = req.body;
        await Leave.findByIdAndUpdate(id, { status });
        res.send("Updated");
    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).send("Error");
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

app.listen(PORT, () => {
    console.log("Server running on " + PORT);
});
