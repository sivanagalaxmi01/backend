
import cors from 'cors';
import express from 'express';
import { connectToDB } from "./db.js";
import { db } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to check server status
app.get('/noon', (req, res) => {
  res.json("Server is running successfully!");
});

// User Sign-In
app.post('/signin', async (req, res) => {
  try {
    const user = await db.collection("ast").findOne({ Email: req.body.Email });
    if (!user) {
      res.json({ message: "User not found" });
    } else if (req.body.password === user.password) {
      res.json({ message: "Login successful", values: user });
    } else {
      res.json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "Internal server error" });
  }
});

// Update Password
app.post('/updatepass', async (req, res) => {
  try {
    const { Email, newPassword } = req.body;
    const result = await db.collection("ast").updateOne(
      { Email: Email },
      { $set: { password: newPassword } }
    );
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Password updated successfully" });
    } else {
      res.status(400).json({ message: "Email not found or password already set" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// User Sign-Up
app.post('/signup', async (req, res) => {
  try {
    const check = await db.collection("ast").findOne({ Email: req.body.Email });
    if (check) {
      return res.json({ message: "Email already exists" });
    }
    await db.collection("ast").insertOne({
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      PhoneNumber: req.body.PhoneNumber,
      Email: req.body.Email,
      password: req.body.password
    });
    res.json({ message: "Signup successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add Review
app.post('/addReview', async (req, res) => {
  const { username, comment } = req.body;
  try {
    const reviewsCollection = db.collection('reviews');
    const result = await reviewsCollection.insertOne({ username, comment });
    res.status(201).json(result.ops[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Reviews
app.get('/reviews', async (req, res) => {
  try {
    const reviews = await db.collection('reviews').find().toArray();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Blog Post
app.post('/addBlog', async (req, res) => {
  const { username, title,place, experience, suggestions } = req.body;
  try {
    const blogsCollection = db.collection('blogs');
    const newBlog = { username, title,place, experience, suggestions };

    const result = await blogsCollection.insertOne(newBlog);
    res.status(201).json({ ...newBlog, _id: result.insertedId });
  } catch (error) {
    console.error('Error in /addBlog route:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Blog Posts
app.get('/blogs', async (req, res) => {
  try {
    const blogs = await db.collection('blogs').find().toArray();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete('/deleteBlog/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Blog.findByIdAndDelete(id); // Delete blog by ID
    res.status(200).send({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Error deleting blog' });
  }
});
// Start Server
app.listen(9000, async () => {
  console.log("Server is running on port 9000");
  await connectToDB();
});

