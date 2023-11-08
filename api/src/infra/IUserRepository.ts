import {IUser} from "./IUser";
import {ICreateUser} from "./ICreateUser";

export interface IUserRepository {
    getBySubId(subId?: string): Promise<IUser | undefined>;
    create(user: ICreateUser): Promise<IUser>;
}