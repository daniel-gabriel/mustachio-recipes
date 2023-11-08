import {IUserDoc, IUserModel, UserModel} from "./UserModel";
import {IUser} from "./IUser";
import {IUserRepository} from "./IUserRepository";
import {ICreateUser} from "./ICreateUser";

export class MongoUserRepository implements IUserRepository {
    public async getBySubId(subId?: string): Promise<IUser | undefined> {
        return this.toExternalModel(await UserModel.findOne({subId: subId || ""}).exec());
    }

    public async create(user: ICreateUser): Promise<IUser> {
        const newUser = new UserModel(<IUserModel>{
            subId: user.subId,
            name: user.name,
            email: user.email,
            createdOn: new Date(),
            lastUpdatedOn: new Date()
        });
        await newUser.save();
        return this.toExternalModel(newUser) as IUser;
    }

    private toExternalModel(user: IUserDoc | null): IUser | undefined {
        if (!user) {
            return undefined;
        }
        return {
            subId: user.subId,
            name: user.name,
            email: user.email,
            createdOn: user.createdOn,
            lastUpdatedOn: user.lastUpdatedOn
        }
    }
}