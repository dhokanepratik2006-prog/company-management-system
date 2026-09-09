DROP DATABASE IF EXISTS company_management;

CREATE DATABASE company_management;

USE company_management;

-- =========================================
-- COMPANIES
-- =========================================

CREATE TABLE companies (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(255),
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    website VARCHAR(150)
);


-- =========================================
-- DEPARTMENTS
-- =========================================

CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    location VARCHAR(100),

    FOREIGN KEY (company_id)
    REFERENCES companies(company_id)
);


-- =========================================
-- EMPLOYEES
-- =========================================

CREATE TABLE employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    job_title VARCHAR(100),
    salary DECIMAL(10,2),
    joining_date DATE,
    status VARCHAR(20),

    FOREIGN KEY (department_id)
    REFERENCES departments(department_id)
);


-- =========================================
-- COMPANY SAMPLE DATA
-- =========================================

INSERT INTO companies
(company_name, email, phone, address, city, state, country, website)
VALUES

('Tech Solutions Pvt Ltd',
 'info@techsolutions.com',
 '9876543210',
 'MG Road',
 'Pune',
 'Maharashtra',
 'India',
 'www.techsolutions.com'),

('Global Services Ltd',
 'info@globalservices.com',
 '9876543211',
 'FC Road',
 'Mumbai',
 'Maharashtra',
 'India',
 'www.globalservices.com'),

('Smart Systems Pvt Ltd',
 'info@smartsystems.com',
 '9876543212',
 'Baner Road',
 'Pune',
 'Maharashtra',
 'India',
 'www.smartsystems.com');


-- =========================================
-- DEPARTMENT SAMPLE DATA
-- =========================================

INSERT INTO departments
(company_id, department_name, location)
VALUES

(1, 'IT', 'Pune'),
(1, 'HR', 'Pune'),
(1, 'Finance', 'Pune'),

(2, 'Sales', 'Mumbai'),
(2, 'Marketing', 'Mumbai'),

(3, 'IT', 'Pune');


-- =========================================
-- EMPLOYEE SAMPLE DATA
-- =========================================

INSERT INTO employees
(department_id, first_name, last_name, email, phone,
 job_title, salary, joining_date, status)
VALUES

(1, 'Rahul', 'Patil',
 'rahul@gmail.com',
 '9876500001',
 'Software Developer',
 45000.00,
 '2025-01-10',
 'Active'),

(1, 'Sneha', 'Sharma',
 'sneha@gmail.com',
 '9876500002',
 'Web Developer',
 42000.00,
 '2025-02-15',
 'Active'),

(2, 'Priya', 'Joshi',
 'priya@gmail.com',
 '9876500003',
 'HR Manager',
 55000.00,
 '2024-08-20',
 'Active'),

(4, 'Amit', 'Kumar',
 'amit@gmail.com',
 '9876500004',
 'Sales Executive',
 35000.00,
 '2025-03-05',
 'Active'),

(1, 'Nikhil', 'More',
 'nikhil@gmail.com',
 '9876500005',
 'Full Stack Developer',
 65000.00,
 '2024-11-18',
 'Active'),

(3, 'Pooja', 'Verma',
 'pooja@gmail.com',
 '9876500006',
 'Account Manager',
 52000.00,
 '2023-09-12',
 'Active'),

(5, 'Rohit', 'Deshmukh',
 'rohit@gmail.com',
 '9876500007',
 'Marketing Lead',
 68000.00,
 '2024-06-03',
 'Active'),

(6, 'Anjali', 'Patel',
 'anjali@gmail.com',
 '9876500008',
 'System Engineer',
 61000.00,
 '2025-02-27',
 'Active');


-- =========================================
-- CHECK DATABASE
-- =========================================

USE company_management;

SHOW TABLES;

DESCRIBE companies;

SELECT * FROM companies;

SELECT * FROM departments;

SELECT * FROM employees;

-- =========================================
-- CUSTOMERS
-- =========================================

CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    city VARCHAR(50),
    country VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Active'
);


-- =========================================
-- PRODUCTS
-- =========================================

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    unit_price DECIMAL(10,2) DEFAULT 0,
    stock_quantity INT DEFAULT 0,

    FOREIGN KEY (company_id)
    REFERENCES companies(company_id)
);


-- =========================================
-- PROJECTS
-- =========================================

CREATE TABLE projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    project_name VARCHAR(100) NOT NULL,
    project_manager VARCHAR(100),
    status VARCHAR(30) DEFAULT 'In Progress',
    budget DECIMAL(12,2) DEFAULT 0,

    FOREIGN KEY (company_id)
    REFERENCES companies(company_id)
);


-- =========================================
-- ORDERS
-- =========================================

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    total_amount DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Pending',

    FOREIGN KEY (customer_id)
    REFERENCES customers(customer_id),

    FOREIGN KEY (product_id)
    REFERENCES products(product_id)
);


-- =========================================
-- PAYMENTS
-- =========================================

CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method VARCHAR(30) DEFAULT 'Cash',
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Paid',

    FOREIGN KEY (order_id)
    REFERENCES orders(order_id)
);


-- =========================================
-- CUSTOMER SAMPLE DATA
-- =========================================

INSERT INTO customers
(customer_name, email, phone, city, country, status)
VALUES
('Aarav Mehta', 'aarav@gmail.com', '9876501001', 'Pune', 'India', 'Active'),
('Neha Singh', 'neha@gmail.com', '9876501002', 'Mumbai', 'India', 'Active'),
('Vikram Shah', 'vikram@gmail.com', '9876501003', 'Delhi', 'India', 'Inactive');


-- =========================================
-- PRODUCT SAMPLE DATA
-- =========================================

INSERT INTO products
(company_id, product_name, category, unit_price, stock_quantity)
VALUES
(1, 'CRM Suite', 'Software', 25000.00, 120),
(1, 'ERP System', 'Software', 42000.00, 80),
(2, 'Marketing Dashboard', 'Analytics', 18000.00, 60),
(3, 'AI Assistant', 'Automation', 35000.00, 40);


-- =========================================
-- PROJECT SAMPLE DATA
-- =========================================

INSERT INTO projects
(company_id, project_name, project_manager, status, budget)
VALUES
(1, 'Website Redesign', 'Karan Patil', 'In Progress', 150000.00),
(2, 'Sales Automation', 'Ritika Joshi', 'Pending', 220000.00),
(3, 'Smart IoT Platform', 'Vineet Rao', 'Completed', 480000.00);


-- =========================================
-- ORDER SAMPLE DATA
-- =========================================

INSERT INTO orders
(customer_id, product_id, quantity, total_amount, status)
VALUES
(1, 1, 2, 50000.00, 'Completed'),
(2, 3, 1, 18000.00, 'Pending'),
(3, 4, 3, 105000.00, 'Completed');


-- =========================================
-- PAYMENT SAMPLE DATA
-- =========================================

INSERT INTO payments
(order_id, payment_method, amount, status)
VALUES
(1, 'UPI', 50000.00, 'Paid'),
(2, 'Card', 18000.00, 'Pending'),
(3, 'Bank Transfer', 105000.00, 'Paid');


-- =========================================
-- VERIFY DATA
-- =========================================

SELECT * FROM customers;
SELECT * FROM products;
SELECT * FROM projects;
SELECT * FROM orders;
SELECT * FROM payments;