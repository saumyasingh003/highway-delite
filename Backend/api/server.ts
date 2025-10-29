import app from "../src/app";
import cors from "cors";
const PORT = process.env.PORT || 4000;
app.use(cors());
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
