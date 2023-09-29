import { Injectable } from '@nestjs/common';
import { DataSource, Equal } from 'typeorm';
import { User } from './entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { Role } from '../roles/roles.enum';
import { hash } from 'bcrypt';
import { Paginated } from './users.interface';

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
    const password: string = await hash(signUpRequest.password, 10);
    return await this.usersRepository().save({
      email: signUpRequest.email,
      password: password,
      role: { id: Role.USER },
    });
  }

  /**
   * Trouver tous les utilisateurs.
   * @returns {Promise<User[]>} - Une promesse résolue avec tous les utilisateurs.
   * @async
   */
  async findAll(page?: number): Promise<Paginated<User>> {
    const [users, nbUsers]: [User[], number] =
      await this.usersRepository().findAndCount({
        relations: { role: true },
        skip: page ? (page - 1) * 10 : 0,
        take: page ? 10 : 99999,
      });

    return {
      result: users,
      nbPages: page ? Math.ceil(nbUsers / 10) : 1,
    };
  }

  /**
   * Trouver un utilisateur par son id.
   * @param {number} id - L'id de l'utilisateur à trouver.
   * @returns {Promise<User>} - Une promesse résolue avec l'utilisateur trouvé.
   * @async
   */
  async findOneById(id: number): Promise<User> {
    return await this.usersRepository().findOneBy({ id });
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
