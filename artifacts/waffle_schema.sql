-- User Roles Table
create table user_roles (
    role_id integer primary key,
    role_name text not null unique
);

-- Users Table
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

-- Tasks Per Role Table
create table tasks_per_role (
    task_id integer primary key autoincrement,
    role_id integer not null,
    task_description text not null,
    completion_timeline text not null,
    foreign key (role_id) references user_roles(role_id)
);

-- Indexes
create index idx_users_role_id on users(role_id);
create index idx_tasks_role_id on tasks_per_role(role_id);