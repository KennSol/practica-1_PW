const express = require('express');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');

const app = express();

app.use(express.json());
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Social API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});