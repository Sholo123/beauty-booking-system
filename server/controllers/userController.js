import {sql} from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 

export const registerUser  = async (req, res) => {

    const {
        first_name,
        last_name, 
        email, 
        password= "None", 
        phone,
        location,
        role = "client"
    } = req.body;

    try {
        // Check if user already exists
        const existingUser = await sql`
            SELECT * FROM users WHERE email = ${email}
        `;
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await sql`
            INSERT INTO users (first_name, last_name, email, password, phone, location, role)
            VALUES (${first_name}, ${last_name}, ${email}, ${hashedPassword}, ${phone}, ${location}, ${role})
            RETURNING *
        `;

        // Generate JWT token
        const token = jwt.sign({ userId: newUser[0].user_id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        console.log("Registered new user:", newUser[0]);


        res.status(201).json({ token });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await sql`
            SELECT * FROM users WHERE email = ${email}
        `;
        if (user.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user[0].user_id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        console.log("User logged in:", user[0]);

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


//Get user profile by ID
export const getUserProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await sql`
            SELECT * FROM users WHERE user_id = ${userId}
        `;
        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user[0]);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//Update user profile by ID
//Update user profile by ID
export const updateUserProfile = async (req, res) => {
    const { userId } = req.params;
    const { first_name, last_name, email, phone, location } = req.body;
    
    const updates = {};
    
    if (first_name !== undefined) updates.first_name = first_name;
    if (last_name !== undefined) updates.last_name = last_name;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (location !== undefined) updates.location = location;
    
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "At least one field is required to update" });
    }
    
    try {
        const result = await sql`
            UPDATE users 
            SET ${sql(updates)}
            WHERE user_id = ${userId}
        `;
        
        if (result.count === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({ message: "User profile updated successfully" });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//Remove user from the system
export const removeUser = async (req, res) => {
    const { userId } = req.params;

    try {
        //Find user by ID and delete
        const result = await sql`
            DELETE FROM users WHERE user_id = ${userId}
        `;
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(204).send();
    } catch (error) {
        console.error("Error removing user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};