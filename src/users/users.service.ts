import { Injectable } from '@nestjs/common';
import { DataSource, Equal } from 'typeorm';
import { User } from './entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { Role } from 'src/roles/roles.enum';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private dataSource: DataSource) {}

  usersRepository() {
    return this.dataSource.getRepository(User);
  }

  /**
   * Créer un utilisateur.
   * @param {SignUpDto} signUpRequest - Les données de l'utilisateur à créer.
   * @returns {Promise<User>} - Une promesse résolue avec l'utilisateur créé.
   * @async
   */
  async signUp(signUpRequest: SignUpDto): Promise<User> {
    const password = await hash(signUpRequest.password, 10);
    return await this.usersRepository().save({
      email: signUpRequest.email,
      password: password,
      role: { id: Role.USER },
    });
  }

  /**
   * Trouver un utilisateur par son email.
   * @param {string} email - L'email de l'utilisateur à trouver.
   * @returns {Promise<User>} - Une promesse résolue avec l'utilisateur trouvé.
   * @async
   */
  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository().findOneBy({ email });
  }

  /**
   * Trouver un utilisateur par son email mais pour la connexion.
   * @param {string} email - L'email de l'utilisateur à trouver.
   * @returns {Promise<User>} - Une promesse résolue avec l'utilisateur trouvé.
   * @async
   */
  async findOneAuthentification(email: string): Promise<User> {
    return await this.usersRepository().findOne({
      relations: { role: true },
      select: ['id', 'email', 'password'],
      where: { email: Equal(email) },
    });
  }
}
