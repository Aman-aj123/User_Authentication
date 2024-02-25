const express = require("express");
const app = express();
const port = 3000;
const path = require('path');
const fs = require("fs");

const mainUserInfoFile = require("./user-info.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public/components"));



// userArr empty array
const userArr = [];

app.get("/", (req, res) => {
     res.sendFile("sign-up.html", { root: path.join(__dirname, "public/components") });
});

//-------> Sign up page validation
app.post("/sign-up", (req, res) => {
     const { name, email, password } = req.body;

     // Check if the user with the same name already exists
     if (mainUserInfoFile.some(user => user.Name === name)) {
          res.send({Error: "This user already exists try another username.."});
          return;
     }

     // If the user name doesn't exist with the same name
     const userInfo = {
          Name: name,
          email: email,
          password: password
     };

     userArr.push(userInfo);

     // Read existing content from the file
     let existingContent = [];
     try {
          existingContent = JSON.parse(fs.readFileSync("user-info.json", "utf-8"));
     } catch (err) {
          console.error("Error reading file:", err);
     }

     // Add the new user information to the existing content
     existingContent.push(userInfo);

     // Write the updated content back to the file
     fs.writeFileSync("user-info.json", JSON.stringify(existingContent, null, 2));

     // Redirect to login page
     res.redirect("/home.html");

});

//-------> Login page validation
app.post("/login", (req, res) => {
     const { email, password } = req.body;

     // Check if there is a user with the provided email
     const user = mainUserInfoFile.find(user => user.email === email);

     if (user && user.password === password) {
          res.redirect("/home.html");
     } else {
          res.send({ Error: "Invalied credentials please check it again.." });
     }
});



// Starting the server
app.listen(port, () => {
     console.log(`Server is running on http://localhost:${port}`);
});
