import { Hono } from "hono";
import UserRoutes from "./routes";

const UserModule = new Hono();

UserModule.route("/users", UserRoutes);

export default UserModule;