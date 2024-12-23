const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");
require('dotenv').config();

const app = express();

// Parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static assets (CSS, JS, images, etc.)
app.use("/static", express.static(path.join(__dirname, "static")));

// Routes for Pages (Updated to reflect root directory for HTML files)
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/skills", (req, res) => res.sendFile(path.join(__dirname, "skills.html")));
app.get("/projects", (req, res) => res.sendFile(path.join(__dirname, "projects.html")));
app.get("/education", (req, res) => res.sendFile(path.join(__dirname, "education.html")));
app.get("/contact", (req, res) => res.sendFile(path.join(__dirname, "contact.html")));

// Contact Form Route
app.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
        service: "gmail", 
        auth: {
            user: process.env.EMAIL_USER,   // Use environment variables
            pass: process.env.EMAIL_PASS,   // Use environment variables
        },
    });

    const mailOptions = {
        from: email,
        to: process.env.RECEIVER_EMAIL,
        subject: `Portfolio Contact Form: ${name}`,
        text: `You have a new message from your portfolio:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `<p>You have a new message from your portfolio:</p>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong> ${message}</p>`,
    };
    try {
        await transporter.sendMail(mailOptions);
        res.sendFile(path.join(__dirname, "thank-you.html"));
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending message. Please try again later.");
    }
});

// Handle 404 for non-existent routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "404.html"));
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
