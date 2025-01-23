const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const UserRouter = require('./routes/authRoutes');
const path = require('path');
// const admin = require("firebase-admin");
// const serviceAccount = require("./firebase-service-account.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const sendNotification = async (deviceToken, title, body) => {
//   try {
//     const message = {
//       notification: {
//         title,
//         body,
//       },
//       token: deviceToken,
//     };

//     const response = await admin.messaging().send(message);
//     console.log("Notification sent successfully:", response);
//   } catch (error) {
//     console.error("Error sending notification:", error);
//   }
// };

require("dotenv").config();

const mongoURI = process.env.MONGO_URI;

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/api", UserRouter);

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// MongoDB connection (use your MongoDB URI)
mongoose.connect(mongoURI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true  
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));