import app from "./app.js";
import { connectDB } from "./db.js";


const PORT = process.env.PORT || 3000;

connectDB();
app.listen(PORT, () => {
    console.log(`Se conecto por ${PORT}`);
})