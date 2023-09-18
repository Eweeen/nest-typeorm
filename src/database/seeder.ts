import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Command } from 'nestjs-command';
import { seedRoles } from './data-fixtures/seed-roles';

@Injectable()
export class SeederCommand {
  constructor(private dataSource: DataSource) {}

  @Command({ command: 'seed', describe: 'Seeds the database' })
  async seed() {
    try {
      // Seed roles
      await seedRoles(this.dataSource);
    } catch (err) {
      console.log(err);
    }
  }
}
