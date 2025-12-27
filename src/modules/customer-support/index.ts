import { Hono } from "hono";
import CustomerSupportRoutes from "./routes";

const CustomerSupportModule = new Hono();

CustomerSupportModule.route("/", CustomerSupportRoutes);

export default CustomerSupportModule;
