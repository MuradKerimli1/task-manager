import { User } from "../Dal/Entity/User.entity";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
