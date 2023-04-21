const express = require('express');
const app = express();
const cors = require("cors");
const jsonwebtoken = require("jsonwebtoken");
const pool = require('./db');
const JWT_SECRET =
    "3AsyozzFoG8dWPEh2R9r4yf20g8dTbdzTfBu3MTKeKeE73tv5JLPuDc3pEB2"; //generated with password generator
const port = 9000;

//middleware
app.use(cors());
app.use(express.json()); // request body

/* ROUTES */

//get all animal categories
app.get('/categories', async(request, response) => {
    try {
        const allCategories = await pool.query('SELECT * FROM animal_categories;');
        response.json(allCategories.rows);
    } catch (error) {
        console.error(error.message);
    }
});

//get all animal photos by category id
app.post('/photos', async(request, response) => {
    try {
        const { id } = request.body;
        const allPhotos = await pool.query(
            "SELECT * FROM animal_photos WHERE category_id IN (" + id+")");
        response.json(allPhotos.rows);
    } catch (error) {
        console.error(error.message);
    }
});

// login with username and password
app.post("/login", (request, response) => {
    const { username, password } = request.body;
    console.log(`${username} is trying to login ..`);

    if (username === "admin" && password === "admin") {
        return response.json({
            token: jsonwebtoken.sign({ user: "admin" }, JWT_SECRET),
        });
    }
    return response
        .status(401)
        .json({ message: "The username and password you provided are invalid" });
});

//get all animal photos and category name
app.get('/show-details', async(request, response) => {
    if (!request.headers.authorization) {
        return response.status(401).json({ error: "Not Authorized" });
    }
    // Bearer <token>
    const authHeader = request.headers.authorization;
    const token = authHeader.split(" ")[1];
    try {
        // Verify the token is valid
        const { user } = jsonwebtoken.verify(token, JWT_SECRET);
        if (response.status(200)) {
            const allCategoryPhotos = await pool.query(
                "SELECT ap.id as id, ap.category_id as category_id, ac.category as category, ap.photo_url as photo_url " +
                "FROM animal_photos as ap INNER JOIN animal_categories as ac ON ac.id = ap.category_id ORDER BY category ASC");
            response.json(allCategoryPhotos.rows);
        }
    } catch (error) {
        return response.status(401).json({ error: "Not Authorized" });
    }
});

//add new category
app.post('/categories/create', async(request, response) => {
    if (!request.headers.authorization) {
        return response.status(401).json({ error: "Not Authorized" });
    }
    // Bearer <token>
    const authHeader = request.headers.authorization;
    const token = authHeader.split(" ")[1];
    try {
        // Verify the token is valid
        const { user } = jsonwebtoken.verify(token, JWT_SECRET);
        if (response.status(200)) {
            const { category_name } = request.body;
            const newCategory = await pool.query(
                "INSERT INTO animal_categories(category) VALUES ($1) RETURNING *",
                [category_name]
            );
            response.json(newCategory.rows[0]);
        }
    } catch (error) {
        return response.json({error : error.message});
    }
});

//add new category photos (UI representation on Admin)
app.post('/categories/create-photos', async(request, response) => {
    if (!request.headers.authorization) {
        return response.status(401).json({ error: "Not Authorized" });
    }
    // Bearer <token>
    const authHeader = request.headers.authorization;
    const token = authHeader.split(" ")[1];
    try {
        // Verify the token is valid
        const { user } = jsonwebtoken.verify(token, JWT_SECRET);
        if (response.status(200)) {
            const { category_id, photo_url } = request.body;
            const newPhoto = await pool.query(
                "INSERT INTO animal_photos(category_id, photo_url) VALUES ($1, $2) RETURNING *",
                [category_id, photo_url]
            );
            response.json(newPhoto.rows[0]);
        }
    } catch (error) {
        return response.json({error : error.message});
    }
});

//delete photos (UI representation on Admin)
app.delete('/categories/delete/:photo_id', async(request, response) => {
    if (!request.headers.authorization) {
        return response.status(401).json({ error: "Not Authorized" });
    }
    // Bearer <token>
    const authHeader = request.headers.authorization;
    const token = authHeader.split(" ")[1];
    try {
        // Verify the token is valid
        const { user } = jsonwebtoken.verify(token, JWT_SECRET);
        if (response.status(200)) {
            const { photo_id } = request.params;
            const checkPhotoExists = await pool.query(
                "SELECT * FROM animal_photos WHERE id = $1",
                [photo_id]
            );
            if(checkPhotoExists.rows.length > 0) {
                const deletePhotos = await pool.query(
                    "DELETE FROM animal_photos WHERE id = $1",
                    [photo_id]
                );
                response.json("Photo is deleted.");
            }
        }
    } catch (error) {
        return response.json({error : error.message});
    }
});

//Update category name
app.put('/categories/update/:category_id', async(request, response) => {
    if (!request.headers.authorization) {
        return response.status(401).json({ error: "Not Authorized" });
    }
    // Bearer <token>
    const authHeader = request.headers.authorization;
    const token = authHeader.split(" ")[1];
    try {
        // Verify the token is valid
        const { user } = jsonwebtoken.verify(token, JWT_SECRET);
        if (response.status(200)) {
            const { category_id } = request.params;
            const { category_name } = request.body;
            const updateCategory = await pool.query(
                "UPDATE animal_categories SET category = $1 WHERE id = $2",
                [category_name, category_id]
            );

            response.json("Category was updated.");
        }
    } catch (error) {
        return response.json({error : error.message});
    }
});

app.listen(port, () => {
    console.log(`Server Started on PORT ${port}`);
})