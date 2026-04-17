import { sql } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Create new user (self-registration).
// Role is hard-coded to "client" — admins must be promoted directly in the DB.
export const registerUser = async (req, res) => {
    const {
        first_name,
        last_name,
        email,
        password,
        phone,
        location,
        province,
    } = req.body;

    // Basic input validation.
    const required = { first_name, last_name, email, password, phone, location, province };
    for (const [key, value] of Object.entries(required)) {
        if (typeof value !== 'string' || value.trim() === '') {
            return res.status(400).json({ message: `Field "${key}" is required` });
        }
    }
    if (!EMAIL_RE.test(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }
    if (password.length < 8 || password.length > 200) {
        return res.status(400).json({ message: 'Password must be 8-200 characters long' });
    }

    try {
        // Check if user already exists
        const existingUser = await sql`
            SELECT user_id FROM users WHERE email = ${email}
        `;
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Force role to 'client' regardless of request body to prevent
        // privilege escalation via self-registration.
        const newUser = await sql`
            INSERT INTO users (first_name, last_name, email, password, phone, location, province, role)
            VALUES (${first_name}, ${last_name}, ${email}, ${hashedPassword}, ${phone}, ${location}, ${province}, 'client')
            RETURNING user_id
        `;

        const token = jwt.sign(
            { userId: newUser[0].user_id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({ token, userId: newUser[0].user_id });
    } catch (error) {
        console.error('Error registering user');
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await sql`
            SELECT user_id, password FROM users WHERE email = ${email}
        `;
        if (user.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user[0].user_id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({ token, userId: user[0].user_id });
    } catch (error) {
        console.error('Error logging in user');
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get user profile by ID. The route guard (requireSelfOrAdmin) makes sure
// only the owner or an admin can read a profile.
export const getUserProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await sql`
            SELECT user_id, first_name, last_name, email, phone, location, province, role, created_at
            FROM users WHERE user_id = ${userId}
        `;
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user[0]);
    } catch (error) {
        console.error('Error fetching user profile');
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update user profile by ID.
// Only whitelisted fields may be updated; role/password are intentionally excluded.
export const updateUserProfile = async (req, res) => {
    const { userId } = req.params;
    const { first_name, last_name, email, phone, location, province } = req.body;

    const updates = {};
    if (first_name !== undefined) updates.first_name = first_name;
    if (last_name !== undefined) updates.last_name = last_name;
    if (email !== undefined) {
        if (!EMAIL_RE.test(email)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }
        updates.email = email;
    }
    if (phone !== undefined) updates.phone = phone;
    if (location !== undefined) updates.location = location;
    if (province !== undefined) updates.province = province;

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'At least one field is required to update' });
    }

    try {
        const result = await sql`
            UPDATE users
            SET ${sql(updates)}
            WHERE user_id = ${userId}
        `;

        if (result.count === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile');
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Remove user from the system. Guard: self or admin.
export const removeUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await sql`
            DELETE FROM users WHERE user_id = ${userId}
        `;
        if (result.count === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error removing user');
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Check if a user is admin. Route is guarded so callers can only check
// themselves (or an admin can check anyone).
export const isAdmin = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await sql`
            SELECT user_id FROM users WHERE user_id = ${userId} AND role = 'admin'
        `;
        res.status(200).json({ isAdmin: user.length > 0 });
    } catch (error) {
        console.error('Error checking admin status');
        res.status(500).json({ message: 'Internal server error' });
    }
};
