import { config } from 'dotenv';
import { Role } from 'src/roles/entities/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EncryptionTransformer } from 'typeorm-encrypted';

config({ path: 'encrypt-db.env' });

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ unsigned: true, type: 'int' })
  id: number;

  @Column({
    name: 'email',
    type: 'varchar',
    unique: true,
    transformer: new EncryptionTransformer({
      key: process.env.USER_EMAIL_ENCRYPTION_KEY,
      algorithm: process.env.ENCRYPTION_ALGORITHM,
      ivLength: +process.env.ENCRYPTION_IV_LENGTH,
      iv: process.env.USER_EMAIL_ENCRYPTION_IV,
    }),
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    select: false,
    transformer: new EncryptionTransformer({
      key: process.env.USER_PASSWORD_ENCRYPTION_KEY,
      algorithm: process.env.ENCRYPTION_ALGORITHM,
      ivLength: +process.env.ENCRYPTION_IV_LENGTH,
      iv: process.env.USER_PASSWORD_ENCRYPTION_IV,
    }),
  })
  password: string;

  //====================================================
  // Relations
  //====================================================

  //+++++++++++++++
  // Many To One
  //+++++++++++++++
  @ManyToOne(() => Role, (role) => role)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
