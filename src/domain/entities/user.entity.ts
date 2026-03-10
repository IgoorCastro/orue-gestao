// entidade do usuario
import { UserRole } from "../enums/user-role.enum";

type UserProps = {
    id: string, 
    name: string,
    role: UserRole, 
    isActive: boolean, 
    createdAt: Date,
} 

export class User {
    private readonly _id: string;
    private readonly _createdAt: Date;
    private _name: string;
    private _role: UserRole;
    private _isActive: boolean;

    constructor(input: UserProps) {       
        if(!input.id) throw new Error("Id cannot be empty");
        if(!input.createdAt) throw new Error("Id cannot be empty");
        this.validateRole(input.role);
        this.validateName(input.name);

        this._id = input.id;
        this._name = input.name;
        this._role = input.role;
        this._isActive = input.isActive;
        this._createdAt = input.createdAt;
    }

    get id(): string {
        return this._id;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get name(): string {
        return this._name;
    }

    rename(name: string): void {
        this.validateName(name);        
        this._name = name;
    }

    get role(): UserRole {
        return this._role;
    }

    changeRole(role: UserRole): void {
        this.validateRole(role);
        this._role = role;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    activate(): void {
        if(this._isActive) return;
        this._isActive = true;
    }

    deactivate(): void {
        if(this._role === UserRole.ADMIN) throw new Error("Admin cannot be deactivated")
        if(!this._isActive) return;
        this._isActive = false;
    }

    isUserAdmin(): boolean {
        return this.role === UserRole.ADMIN;
    }

    isUserManager(): boolean {
        return this.role === UserRole.MANAGER;
    }

    isUserOperator(): boolean {
        return this.role === UserRole.OPERATOR;
    }

    isUserActive(): boolean {
        return this._isActive;
    }

    private validateName(name: string): void {
        if(name.length < 3) throw new Error("Invalid name - Name must be longer than 3 characters");
        if(!name || name.trim().length === 0) throw new Error("Name cannot be empty");
    }

    private validateRole(role: UserRole): void {
        if(!role || !Object.values(UserRole).includes(role)) throw new Error("Role is invalid");
    }
};