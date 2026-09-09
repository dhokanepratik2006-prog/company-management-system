// ======================================================
// COMPANY MANAGEMENT SYSTEM - SCRIPT.JS
// ======================================================


// ======================================================
// 1. OPEN / CHANGE SECTIONS
// ======================================================

function showSection(sectionId, button) {

    // Hide all sections
    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.remove("active");
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.add("active");
    }

    // Remove active class from all navigation buttons
    const buttons = document.querySelectorAll(".nav-btn");

    buttons.forEach(btn => {
        btn.classList.remove("active");
    });

    // Add active class to clicked button
    if (button) {
        button.classList.add("active");
    }

    // Change page title
    const titles = {
        dashboard: "Dashboard",
        companies: "Companies",
        employees: "Employees",
        customers: "Customers",
        departments: "Departments",
        products: "Products",
        projects: "Projects",
        orders: "Orders",
        payments: "Payments"
    };

    const pageTitle = document.getElementById("pageTitle");

    if (pageTitle) {
        pageTitle.innerText =
            titles[sectionId] || "Company Management System";
    }

    // Load company records when Companies is opened
    if (sectionId === "companies") {
        loadCompanies();
    }
}


// ======================================================
// 2. ADD COMPANY BUTTON
// ======================================================

function openCompanyForm() {

    const form = document.getElementById("companyForm");

    if (form) {

        form.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        const companyName =
            document.getElementById("companyName");

        if (companyName) {
            companyName.focus();
        }
    }
}


// ======================================================
// 3. COMPANY FORM SUBMIT
// ======================================================

const companyForm =
    document.getElementById("companyForm");


if (companyForm) {

    companyForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            // Get company information
            const companyName =
                document.getElementById("companyName")?.value.trim();

            const companyEmail =
                document.getElementById("companyEmail")?.value.trim();

            const companyPhone =
                document.getElementById("companyPhone")?.value.trim();

            const companyCity =
                document.getElementById("companyCity")?.value.trim();

            const companyAddress =
                document.getElementById("companyAddress")?.value.trim();


            // Check company name
            if (!companyName) {

                alert("Please enter company name.");

                return;
            }


            // Create data object
            const companyData = {

                company_name: companyName,

                email: companyEmail,

                phone: companyPhone,

                city: companyCity,

                address: companyAddress

            };


            console.log(
                "Sending company data:",
                companyData
            );


            try {

                // Send data to app.js
                const response = await fetch(
                    "/api/companies",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(companyData)
                    }
                );


                // Convert response to JSON
                const result =
                    await response.json();


                console.log(
                    "Server response:",
                    result
                );


                // Success
                if (response.ok && result.success) {

                    alert(
                        "✅ Company added successfully!"
                    );


                    // Clear form
                    companyForm.reset();


                    // Refresh company table
                    loadCompanies();


                } else {

                    alert(
                        "❌ Error: " +
                        (result.message ||
                            "Company could not be added.")
                    );

                }


            } catch (error) {

                console.error(
                    "Connection error:",
                    error
                );

                alert(
                    "❌ Server connection failed.\n\n" +
                    "Make sure app.js is running."
                );
            }

        }
    );
}


// ======================================================
// 4. LOAD COMPANIES FROM MYSQL
// ======================================================

async function loadCompanies() {

    try {

        const response =
            await fetch("/api/companies");


        if (!response.ok) {

            throw new Error(
                "Unable to fetch companies"
            );
        }


        const companies =
            await response.json();


        console.log(
            "Companies received:",
            companies
        );


        // Company table
        const tableBody =
            document.getElementById(
                "companyTableBody"
            );


        if (!tableBody) {

            console.log(
                "Company table not found."
            );

            return;
        }


        // Clear existing rows
        tableBody.innerHTML = "";


        // Update dashboard company count
        const companyCount =
            document.getElementById(
                "companyCount"
            );


        if (companyCount) {

            companyCount.innerText =
                companies.length;

        }


        // If there are no companies
        if (companies.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5"
                        style="text-align:center;">
                        No company records found.
                    </td>
                </tr>
            `;

            return;
        }


        // Add each company to table
        companies.forEach(company => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${company.id}
                </td>

                <td>
                    ${escapeHTML(
                        company.company_name || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        company.email || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        company.phone || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        company.city || "-"
                    )}
                </td>

            `;


            tableBody.appendChild(row);

        });


    } catch (error) {

        console.error(
            "Error loading companies:",
            error
        );

    }
}


// ======================================================
// 5. SEARCH COMPANIES
// ======================================================

function searchCompanies() {

    const searchBox =
        document.getElementById(
            "companySearch"
        );


    if (!searchBox) {
        return;
    }


    const searchText =
        searchBox.value.toLowerCase();


    const rows =
        document.querySelectorAll(
            "#companyTableBody tr"
        );


    rows.forEach(row => {

        const rowText =
            row.innerText.toLowerCase();


        if (rowText.includes(searchText)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });
}


// ======================================================
// 6. ESCAPE HTML
// ======================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


// ======================================================
// 7. CURRENT DATE
// ======================================================

const currentDate =
    document.getElementById(
        "currentDate"
    );


if (currentDate) {

    currentDate.innerText =
        new Date().toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );
}


// ======================================================
// 8. LOAD COMPANY DATA WHEN PAGE OPENS
// ======================================================

loadCompanies();