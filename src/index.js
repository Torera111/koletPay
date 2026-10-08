import express from 'express';
import cors from 'cors';
import connectDB from "./config/db.js";
import invoiceRoutes from "./routes/invoice.routes.js";
 
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// app.use('/api/v1/invoices',  invoiceRoutes)

const PORT = process.env.PORT || 5000;
console.log(process.env.PORT)
app.listen(PORT, () => console.log(`Server sprinting on port ${PORT}`));
