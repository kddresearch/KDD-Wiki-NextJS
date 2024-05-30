import { 
    integer,
    pgEnum,
    pgTable,
    serial,
    text,
    uniqueIndex,
    varchar
} from 'drizzle-orm/pg-core';

export const test_orm_user_role = pgEnum('test_orm_user_role', ['admin', 'user']);

export const test_orm_user = pgTable('test_orm_user', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }),
    age: integer('age'),
    email: text('email'),
    role: test_orm_user_role('test_orm_user_role'),
}, (test_orm_user) => {
    return {
        nameIndex: uniqueIndex('name_idx').on(test_orm_user.name),
    }
});


