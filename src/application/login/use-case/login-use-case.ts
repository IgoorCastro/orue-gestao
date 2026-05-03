// use-case para autenticação de usuario

import { UserRepository } from "@/src/domain/repositories/user.repository";
import { HashService } from "@/src/domain/services/hash.service";
import { LoginInputDTO, LoginOutputDTO } from "../dto/login.dto";
import { ValidationError } from "@/src/domain/errors/validation.error";
import jwt from 'jsonwebtoken';

export class LoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashService: HashService,
  ) { }

  async execute(data: LoginInputDTO): Promise<LoginOutputDTO | null> {
    // procura um usuario pelo nickname
    const user = await this.userRepository.findByNickname(data.nickname);

    // nickname não existente
    if (!user) return null;

    // compara a senha digitada com a senha do usuario
    const isPasswordValid = await this.hashService.compare(
      data.password,
      user.password.getValue()
    );

    // compração de senha falha
    if (!isPasswordValid) return null;

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'secret_chave_mestra',
      { expiresIn: '1d' }
    );

    return {
      user: { id: user.id, nickname: user.nickname, role: user.role },
      token,
    };
  }
}