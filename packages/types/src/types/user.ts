import { Rating } from "./offer";

type User = {
  id: number;
  username: string;
  firstname: string | null ;
  lastname: string | null;
  email: string;
  registerDate: Date;
  avatarUUID: string | null;
  isAdmin?: boolean;
  ratings?: Rating[];
}

export { User };