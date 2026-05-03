// Test Login Script
// Update the credentials below with your test user
const testEmail = "admin@tealeaf.com"; // Change this
const testPassword = "your_password_here"; // Change this

fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: testEmail, password: testPassword })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
