INSERT INTO user_roles (role_id, role_name) VALUES (1, 'Software Engineer');
INSERT INTO user_roles (role_id, role_name) VALUES (2, 'HR Manager');
INSERT INTO user_roles (role_id, role_name) VALUES (3, 'Project Manager');
INSERT INTO user_roles (role_id, role_name) VALUES (4, 'Product Owner');
INSERT INTO user_roles (role_id, role_name) VALUES (5, 'Data Analyst');
INSERT INTO user_roles (role_id, role_name) VALUES (6, 'Designer');
INSERT INTO user_roles (role_id, role_name) VALUES (7, 'QA Engineer');
INSERT INTO user_roles (role_id, role_name) VALUES (8, 'Marketing Specialist');
INSERT INTO user_roles (role_id, role_name) VALUES (9, 'Sales Representative');
INSERT INTO user_roles (role_id, role_name) VALUES (10, 'Customer Support');

INSERT INTO users (user_id, first_name, last_name, email, hire_date, role_id, bio) VALUES (1, 'John', 'Doe', 'john.doe@company.com', '2023-01-02', 1, 'Experienced software engineer with a passion for developing innovative programs.');
INSERT INTO users (user_id, first_name, last_name, email, hire_date, role_id, bio) VALUES (2, 'Jane', 'Smith', 'jane.smith@company.com', '2023-01-03', 2, 'HR manager with a knack for improving employee relations and fostering a vibrant workplace culture.');
INSERT INTO users (user_id, first_name, last_name, email, hire_date, role_id, bio) VALUES (3, 'Alice', 'Brown', 'alice.brown@company.com', '2023-01-04', 3, 'Project manager who excels at orchestrating complex project requirements and tasks.');
INSERT INTO users (user_id, first_name, last_name, email, hire_date, role_id, bio) VALUES (4, 'Robert', 'Johnson', 'robert.johnson@company.com', '2023-01-05', 4, 'Product owner committed to delivering user-centric products.');
INSERT INTO users (user_id, first_name, last_name, email, hire_date, role_id, bio) VALUES (5, 'Emily', 'Davis', 'emily.davis@company.com', '2023-01-06', 5, 'Data analyst with a keen eye for detail and a passion for data-driven insights.');
INSERT INTO users (user_id, first_name, last_name, email, hire_date, role_id, bio) VALUES (6, 'Michael', 'Wilson', 'michael.wilson@company.com', '2023-01-07', 6, 'Creative designer with a flair for innovative visual solutions.');
INSERT INTO users (user_id, first_name, last_name, email, hire_date, role_id, bio) VALUES (7, 'Sarah', 'Moore', 'sarah.moore@company.com', '2023-01-08', 7, 'QA engineer dedicated to ensuring product quality and reliability.');
INSERT INTO users (user_id, first_name, last_name, email, hire_date, role_id, bio) VALUES (8, 'David', 'Taylor', 'david.taylor@company.com', '2023-01-09', 8, 'Marketing specialist focused on building brand awareness and driving sales.');
INSERT INTO users (user_id, first_name, last_name, email, hire_date, role_id, bio) VALUES (9, 'Laura', 'Anderson', 'laura.anderson@company.com', '2023-01-10', 9, 'Sales representative skilled in closing deals and building customer relationships.');
INSERT INTO users (user_id, first_name, last_name, email, hire_date, role_id, bio) VALUES (10, 'James', 'Thomas', 'james.thomas@company.com', '2023-01-11', 10, 'Customer support specialist committed to resolving customer issues efficiently.');

-- Additional 40 users to follow the pattern (ensure unique emails and hire dates)

INSERT INTO tasks_per_role (role_id, task_description, completion_timeline) VALUES (1, 'Complete I-9 Form', '2023-02-01');
INSERT INTO tasks_per_role (role_id, task_description, completion_timeline) VALUES (1, 'Setup Workstation', '2023-02-02');
INSERT INTO tasks_per_role (role_id, task_description, completion_timeline) VALUES (1, 'Attend Security Training', '2023-02-03');
INSERT INTO tasks_per_role (role_id, task_description, completion_timeline) VALUES (1, 'Submit Code of Conduct Acknowledgment', '2023-02-04');
INSERT INTO tasks_per_role (role_id, task_description, completion_timeline) VALUES (1, 'Complete Benefits Enrollment', '2023-02-05');
INSERT INTO tasks_per_role (role_id, task_description, completion_timeline) VALUES (2, 'Review Company Policies', '2023-02-01');
INSERT INTO tasks_per_role (role_id, task_description, completion_timeline) VALUES (2, 'Conduct New Hire Orientation', '2023-02-02');
INSERT INTO tasks_per_role (role_id, task_description, completion_timeline) VALUES (2, 'Set Up Employee Files', '2023-02-03');
INSERT INTO tasks_per_role (role_id, task_description, completion_timeline) VALUES (2, 'Monitor Compliance Training', '2023-02-04');
INSERT INTO tasks_per_role (role_id, task_description, completion_timeline) VALUES (2, 'Facilitate Team Introductions', '2023-02-05');

-- Additional tasks for other roles following the pattern, ensuring unique task descriptions and timelines