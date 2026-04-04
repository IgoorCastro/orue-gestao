import { UserRole } from "@/src/domain/enums/user-role.enum";
import { UserRepository } from "@/src/domain/repositories/user.repository";

type Input = {
    id?: string;
    name?: string;
    role?: UserRole;
    nickname?: string,
};

export class FindUsersUseCase {
    constructor(private readonly userRepository: UserRepository) {}
    async execute(input: Input) {
        // caso o find for por ID
        if (input.id) return this.userRepository.findById(input.id);

        return this.userRepository.findMany({
            name: input.name,
            role: input.role,
            nickname: input.nickname,
        });
    }
}