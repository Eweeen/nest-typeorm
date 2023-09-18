import { DataSource } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

export async function seedRoles(dataSource: DataSource) {
  const rolesRepository = dataSource.getRepository(Role);

  const roles = [
    rolesRepository.save({
      id: 1,
      label: 'admin',
    }),
    rolesRepository.save({
      id: 2,
      label: 'user',
    }),
  ];

  await Promise.all(roles);
}
