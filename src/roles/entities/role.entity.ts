import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EncryptionTransformer } from 'typeorm-encrypted';
import { config } from 'dotenv';

config({ path: 'encrypt-db.env' });

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn({ unsigned: true, type: 'tinyint' })
  id: number;

  @Column({
    name: 'label',
    type: 'varchar',
    transformer: new EncryptionTransformer({
      key: process.env.ROLE_LABEL_ENCRYPTION_KEY,
      algorithm: process.env.ENCRYPTION_ALGORITHM,
      ivLength: +process.env.ENCRYPTION_IV_LENGTH,
      iv: process.env.ROLE_LABEL_ENCRYPTION_IV,
    }),
  })
  label: string;

  //====================================================
  // Relations
  //====================================================

  //+++++++++++++++
  // One To Many
  //+++++++++++++++
  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
