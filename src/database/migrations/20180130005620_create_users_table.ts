import * as Knex from 'knex';

import Table from '../../resources/enums/Table';

export function up(knex: Knex) {
  return knex.schema.createTable(Table.USERS, table => {
    table.increments('id').primary();
    table
      .string('email')
      .notNullable()
      .unique();
    table
      .integer('role_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(Table.USER_ROLES);

    table.string('name').notNullable();

    table.timestamps(true, true);
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable(Table.USERS);
}
