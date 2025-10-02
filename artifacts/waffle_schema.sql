create table user_roles (
    role_id integer primary key,
    role_name text not null unique
);

create table users (
    user_id integer primary key,
    first_name text not null,
    last_name text not null,
    email text not null unique,
    hire_date text not null,
    role_id integer not null,
    bio text,
    foreign key (role_id) references user_roles(role_id),
    check (email like '%@%')
);

create index idx_users_role_id on users(role_id);