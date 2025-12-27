import { Hono } from "hono";
import CustomerSupportModule from "./customer-support";
import UserModule from "./users";

const appRoutes = new Hono();

appRoutes.route("/", UserModule);
appRoutes.route("/", CustomerSupportModule);

export default appRoutes;
