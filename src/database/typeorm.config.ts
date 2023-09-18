import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  extra: {
    socketPath: process.env.DB_SOCKET,
  },
  migrationsTableName: 'migrations',
  // Nest wants entities has an array of all the entities of the project (impossible with TypeORM)
  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: ['dist/migrations/*.{ts,js}'],
  subscribers: ['dist/**/entities/subscribers/*.subscriber.{ts,js}'],
  synchronize: false,
});
