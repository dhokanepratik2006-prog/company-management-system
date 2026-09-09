import "dotenv/config";
import express from "express";
import mysql from "mysql2/promise";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const DB_HOST = process.env.DB_HOST || "";
const DB_USER = process.env.DB_USER || "";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "company_management";
const DB_PORT = Number(process.env.DB_PORT) || 3306;

if (!DB_HOST || !DB_USER || !DB_PASSWORD) {
    throw new Error("Missing database environment variables: DB_HOST, DB_USER, and DB_PASSWORD");
}


// ========================================
// MYSQL CONNECTION
// ========================================

const db = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT
});

console.log("MySQL connected successfully!");


// ========================================
// MIDDLEWARE
// ========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("Public"));


// ========================================
// HOME PAGE
// ========================================

app.get("/", (req, res) => {

    res.sendFile(
        process.cwd() + "/Public/index.html"
    );

});


// ========================================
// TEST SERVER
// ========================================

app.get("/test", (req, res) => {

    res.send(
        "Company Management Server is working!"
    );

});


// ========================================
// DASHBOARD SUMMARY
// ========================================

app.get("/api/dashboard", async (req, res) => {

    try {

        const [companyRows] = await db.execute(
            "SELECT COUNT(*) AS total FROM companies"
        );

        const [employeeRows] = await db.execute(
            "SELECT COUNT(*) AS total FROM employees"
        );

        const [departmentRows] = await db.execute(
            "SELECT COUNT(*) AS total FROM departments"
        );

        res.json({
            companyCount: companyRows[0].total,
            employeeCount: employeeRows[0].total,
            departmentCount: departmentRows[0].total
        });

    } catch (error) {

        console.error("DASHBOARD ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});


// ========================================
// GET ALL COMPANIES
// ========================================

app.get("/api/companies", async (req, res) => {

    try {

        const [rows] = await db.execute(`
            SELECT
                company_id,
                company_name,
                email,
                phone,
                address,
                city,
                state,
                country,
                website
            FROM companies
            ORDER BY company_id DESC
        `);

        res.json(rows);

    } catch (error) {

        console.error(
            "GET COMPANIES ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});


// ========================================
// ADD COMPANY
// ========================================

app.post("/api/companies", async (req, res) => {

    console.log(
        "POST /api/companies received"
    );

    console.log(
        req.body
    );


    try {

        const {
            company_name,
            email,
            phone,
            address,
            city,
            state,
            country,
            website
        } = req.body;


        if (!company_name) {

            return res.status(400).json({

                success: false,

                message:
                    "Company name is required"

            });

        }


        const sql = `
            INSERT INTO companies
            (
                company_name,
                email,
                phone,
                address,
                city,
                state,
                country,
                website
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;


        const [result] = await db.execute(
            sql,
            [
                company_name,
                email || null,
                phone || null,
                address || null,
                city || null,
                state || null,
                country || null,
                website || null
            ]
        );


        console.log(
            "Company inserted successfully!"
        );

        console.log(
            "Company ID:",
            result.insertId
        );


        res.json({

            success: true,

            message:
                "Company added successfully!",

            id:
                result.insertId

        });


    } catch (error) {

        console.error(
            "DATABASE ERROR:"
        );

        console.error(
            error
        );


        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

});


// ========================================
// GET ALL DEPARTMENTS
// ========================================

app.get("/api/departments", async (req, res) => {

    try {

        const [rows] = await db.execute(`
            SELECT
                d.department_id,
                d.department_name,
                d.location,
                c.company_name
            FROM departments d
            JOIN companies c ON c.company_id = d.company_id
            ORDER BY d.department_id DESC
        `);

        res.json(rows);

    } catch (error) {

        console.error("GET DEPARTMENTS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});


// ========================================
// GET ALL EMPLOYEES
// ========================================

app.get("/api/employees", async (req, res) => {

    try {

        const [rows] = await db.execute(`
            SELECT
                e.employee_id,
                e.first_name,
                e.last_name,
                e.email,
                e.phone,
                e.job_title,
                e.salary,
                e.joining_date,
                e.status,
                d.department_name,
                c.company_name
            FROM employees e
            JOIN departments d ON d.department_id = e.department_id
            JOIN companies c ON c.company_id = d.company_id
            ORDER BY e.employee_id DESC
        `);

        res.json(rows);

    } catch (error) {

        console.error("GET EMPLOYEES ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});


// ========================================
// ADD EMPLOYEE
// ========================================

app.post("/api/employees", async (req, res) => {

    try {

        const {
            first_name,
            last_name,
            email,
            phone,
            job_title,
            department_id,
            salary,
            joining_date,
            status
        } = req.body;


        if (!first_name || !last_name || !department_id) {
            return res.status(400).json({
                success: false,
                message: "First name, last name and department are required."
            });
        }

        const sql = `
            INSERT INTO employees
            (
                department_id,
                first_name,
                last_name,
                email,
                phone,
                job_title,
                salary,
                joining_date,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(sql, [
            department_id,
            first_name,
            last_name,
            email || null,
            phone || null,
            job_title || null,
            salary || null,
            joining_date || null,
            status || "Active"
        ]);

        res.json({
            success: true,
            message: "Employee added successfully!",
            id: result.insertId
        });

    } catch (error) {

        console.error("ADD EMPLOYEE ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});


// ========================================
// GET ALL CUSTOMERS
// ========================================

app.get("/api/customers", async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT *
            FROM customers
            ORDER BY customer_id DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error("GET CUSTOMERS ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});


app.post("/api/customers", async (req, res) => {
    try {
        const { customer_name, email, phone, city, country, status } = req.body;

        if (!customer_name) {
            return res.status(400).json({ success: false, message: "Customer name is required." });
        }

        const sql = `INSERT INTO customers (customer_name, email, phone, city, country, status) VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [customer_name, email || null, phone || null, city || null, country || null, status || "Active"]);

        res.json({ success: true, message: "Customer added successfully!", id: result.insertId });
    } catch (error) {
        console.error("ADD CUSTOMER ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});


// ========================================
// GET ALL PRODUCTS
// ========================================

app.get("/api/products", async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT p.*, c.company_name
            FROM products p
            JOIN companies c ON c.company_id = p.company_id
            ORDER BY p.product_id DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error("GET PRODUCTS ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});


app.post("/api/products", async (req, res) => {
    try {
        const { product_name, category, unit_price, stock_quantity, company_id } = req.body;

        if (!product_name || !company_id) {
            return res.status(400).json({ success: false, message: "Product name and company are required." });
        }

        const sql = `INSERT INTO products (product_name, category, unit_price, stock_quantity, company_id) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [product_name, category || null, unit_price || 0, stock_quantity || 0, company_id]);

        res.json({ success: true, message: "Product added successfully!", id: result.insertId });
    } catch (error) {
        console.error("ADD PRODUCT ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});


// ========================================
// GET ALL PROJECTS
// ========================================

app.get("/api/projects", async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT p.*, c.company_name
            FROM projects p
            JOIN companies c ON c.company_id = p.company_id
            ORDER BY p.project_id DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error("GET PROJECTS ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});


app.post("/api/projects", async (req, res) => {
    try {
        const { project_name, company_id, project_manager, status, budget } = req.body;

        if (!project_name || !company_id) {
            return res.status(400).json({ success: false, message: "Project name and company are required." });
        }

        const sql = `INSERT INTO projects (project_name, company_id, project_manager, status, budget) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [project_name, company_id, project_manager || null, status || "In Progress", budget || 0]);

        res.json({ success: true, message: "Project added successfully!", id: result.insertId });
    } catch (error) {
        console.error("ADD PROJECT ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});


// ========================================
// GET ALL ORDERS
// ========================================

app.get("/api/orders", async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT o.*, c.customer_name, p.product_name
            FROM orders o
            JOIN customers c ON c.customer_id = o.customer_id
            JOIN products p ON p.product_id = o.product_id
            ORDER BY o.order_id DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error("GET ORDERS ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});


app.post("/api/orders", async (req, res) => {
    try {
        const { customer_id, product_id, quantity, total_amount, status } = req.body;

        if (!customer_id || !product_id) {
            return res.status(400).json({ success: false, message: "Customer and product are required." });
        }

        const sql = `INSERT INTO orders (customer_id, product_id, quantity, total_amount, status) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [customer_id, product_id, quantity || 1, total_amount || 0, status || "Pending"]);

        res.json({ success: true, message: "Order added successfully!", id: result.insertId });
    } catch (error) {
        console.error("ADD ORDER ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});


// ========================================
// GET ALL PAYMENTS
// ========================================

app.get("/api/payments", async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT p.*, o.order_id, c.customer_name
            FROM payments p
            JOIN orders o ON o.order_id = p.order_id
            JOIN customers c ON c.customer_id = o.customer_id
            ORDER BY p.payment_id DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error("GET PAYMENTS ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});


app.post("/api/payments", async (req, res) => {
    try {
        const { order_id, payment_method, amount, status } = req.body;

        if (!order_id || !amount) {
            return res.status(400).json({ success: false, message: "Order and amount are required." });
        }

        const sql = `INSERT INTO payments (order_id, payment_method, amount, status) VALUES (?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [order_id, payment_method || "Cash", amount, status || "Paid"]);

        res.json({ success: true, message: "Payment added successfully!", id: result.insertId });
    } catch (error) {
        console.error("ADD PAYMENT ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});


// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {

    console.log(
        "================================="
    );

    console.log(
        " COMPANY MANAGEMENT SYSTEM"
    );

    console.log(
        "================================="
    );

    console.log(
        "MySQL: Connected"
    );

    console.log(
        `Server: http://localhost:${PORT}`
    );

    console.log(
        "================================="
    );

});