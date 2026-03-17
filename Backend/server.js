import "dotenv/config";
import app from "./src/app.js";
import ConnectDB from "./src/config/database.js";
import { testAi } from "./src/services/ai.service.js";

const PORT = process.env.PORT || 3000;

ConnectDB();
// testAi();


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
