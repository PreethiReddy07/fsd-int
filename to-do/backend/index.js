const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const taskRoutes=require('./routes/task');
const authRoutes=require('./routes/auth');
const userRoutes=require('./routes/user');

require('dotenv').config()


const PORT=process.env.PORT
const app=express();
app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("MongoDB connection error:", err));

app.use('/api/auth',authRoutes);
app.use('/api/tasks',taskRoutes);
app.use('/api/users',userRoutes);

app.listen(PORT,()=>console.log(`http://localhost:${PORT}`));

