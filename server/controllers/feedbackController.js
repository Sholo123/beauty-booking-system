import {sql} from '../config/db.js';

// Validate that an ID looks like a positive integer (path params arrive as strings).
const isValidId = (id) => {
    if (id === undefined || id === null || id === '') return false;
    const n = Number(id);
    return Number.isInteger(n) && n > 0;
};

//Create a feedback for a service by a user
export const createFeedback = async (req, res) => {
      const { appointmentId, userId, serviceId } = req.params;
      const { rating, comment } = req.body ?? {};

      // Validate path parameters up-front so we never pass garbage into SQL.
      if (!isValidId(appointmentId)) {
          return res.status(400).json({ message: "Invalid appointmentId: must be a positive integer." });
      }
      if (!isValidId(userId)) {
          return res.status(400).json({ message: "Invalid userId: must be a positive integer." });
      }
      if (!isValidId(serviceId)) {
          return res.status(400).json({ message: "Invalid serviceId: must be a positive integer." });
      }

      // Validate body
      if (rating === undefined || rating === null || rating === '') {
          return res.status(400).json({ message: "Rating is required." });
      }
      const ratingNum = Number(rating);
      if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
          return res.status(400).json({ message: "Rating must be an integer between 1 and 5." });
      }
      if (comment !== undefined && comment !== null && typeof comment !== 'string') {
          return res.status(400).json({ message: "Comment must be a string." });
      }
      if (typeof comment === 'string' && comment.length > 1000) {
          return res.status(400).json({ message: "Comment must not exceed 1000 characters." });
      }

      try {
          // 1. Verify the appointment exists, belongs to this user/service, and is confirmed.
          const existingAppointment = await sql`
                SELECT appointment_id FROM appointments
                WHERE appointment_id = ${appointmentId} AND user_id = ${userId} AND service_id = ${serviceId}
                AND status = 'confirmed'
          `;

          if (existingAppointment.length === 0) {
              return res.status(404).json({
                  message: "No confirmed appointment found for the given appointmentId, userId, and serviceId. Feedback can only be created for a confirmed appointment."
              });
          }

          // 2. Reject duplicate reviews for the same appointment.
          const existingFeedback = await sql`
                SELECT feedback_id FROM feedback
                WHERE appointment_id = ${appointmentId} AND user_id = ${userId} AND service_id = ${serviceId}
          `;

          if (existingFeedback.length > 0) {
              return res.status(409).json({
                  message: "A review already exists for this appointment. Please edit or delete the existing review instead."
              });
          }

          const newFeedback = await sql`
              INSERT INTO feedback (appointment_id, user_id, service_id, rating, comment)
              VALUES (${appointmentId}, ${userId}, ${serviceId}, ${ratingNum}, ${comment ?? null})
              RETURNING *
          `;

          console.log("Created new feedback:", newFeedback[0]);
          return res.status(201).json(newFeedback[0]);
      } catch (error) {
          console.error("Error creating feedback:", error);
          return res.status(500).json({ message: "Internal server error" });
      }
};


//Update a feedback
export const updateFeedback = async (req, res) => {
      const { feedbackId, userId, serviceId } = req.params;
      const { rating, comment } = req.body ?? {};

      if (!isValidId(feedbackId)) {
          return res.status(400).json({ message: "Invalid feedbackId: must be a positive integer." });
      }
      if (!isValidId(userId)) {
          return res.status(400).json({ message: "Invalid userId: must be a positive integer." });
      }
      if (!isValidId(serviceId)) {
          return res.status(400).json({ message: "Invalid serviceId: must be a positive integer." });
      }

      const updates = {};

      // Only add fields that are explicitly provided (not undefined), and validate them.
      if (rating !== undefined) {
          const ratingNum = Number(rating);
          if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
              return res.status(400).json({ message: "Rating must be an integer between 1 and 5." });
          }
          updates.rating = ratingNum;
      }
      if (comment !== undefined) {
          if (comment !== null && typeof comment !== 'string') {
              return res.status(400).json({ message: "Comment must be a string." });
          }
          if (typeof comment === 'string' && comment.length > 1000) {
              return res.status(400).json({ message: "Comment must not exceed 1000 characters." });
          }
          updates.comment = comment;
      }

      if (Object.keys(updates).length === 0) {
          return res.status(400).json({ message: "At least one field (rating or comment) is required to update." });
      }

      try {
          const updatedFeedback = await sql`
              UPDATE feedback
              SET ${sql(updates)}
              WHERE feedback_id = ${feedbackId} AND user_id = ${userId} AND service_id = ${serviceId}
              RETURNING *
          `;

          if (updatedFeedback.length === 0) {
              return res.status(404).json({ message: "Feedback not found for the given feedbackId, userId, and serviceId." });
          }

          console.log("Updated feedback:", updatedFeedback[0]);
          return res.status(200).json(updatedFeedback[0]);
      } catch (error) {
          console.error("Error updating feedback:", error);
          return res.status(500).json({ message: "Internal server error" });
      }
};

//Get feedbacks for a service
export const getFeedbacksByServiceId = async (req, res) => {
    const { serviceId } = req.params;

    if (!isValidId(serviceId)) {
        return res.status(400).json({ message: "Invalid serviceId: must be a positive integer." });
    }

    try {
        const feedbacks = await sql`
            SELECT 
            feedback.feedback_id,
            feedback.appointment_id,
            feedback.user_id,
            feedback.service_id,
            feedback.rating,
            feedback.comment,
            feedback.created_at,
            services.name AS service_name,
            services.description AS service_description,
            services.price AS service_price,
            services.duration_minutes AS service_duration
            FROM feedback
            JOIN services ON feedback.service_id = services.service_id
            WHERE feedback.service_id = ${serviceId}
        `;

        console.log("Retrieved feedbacks:", feedbacks);
        return res.status(200).json(feedbacks);
    } catch (error) {
        console.error("Error retrieving feedbacks:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//Get feedbacks by user ID
export const getFeedbacksByUserId = async (req, res) => {
    const { userId } = req.params;

    if (!isValidId(userId)) {
        return res.status(400).json({ message: "Invalid userId: must be a positive integer." });
    }

    try {
        const feedbacks = await sql`
        SELECT
            feedback.feedback_id,
            feedback.appointment_id,
            feedback.user_id,
            feedback.service_id,
            feedback.rating,
            feedback.comment,
            feedback.created_at,
            services.name AS service_name,
            services.description AS service_description,
            services.price AS service_price,
            services.duration_minutes AS service_duration,
            service_images.image_url AS service_image_url
            FROM feedback
            JOIN services ON feedback.service_id = services.service_id
            LEFT JOIN service_images ON services.service_id = service_images.service_id
            WHERE feedback.user_id = ${userId}
        `;

        console.log("Retrieved feedbacks:", feedbacks);
        return res.status(200).json(feedbacks);
    } catch (error) {
        console.error("Error retrieving feedbacks:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//get all feedbacks (admin)
export const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await sql`
            SELECT 
            feedback.feedback_id,
            feedback.appointment_id,
            feedback.user_id,
            feedback.service_id,
            feedback.rating,
            feedback.comment,
            feedback.created_at,
            services.name AS service_name,
            services.description AS service_description,
            services.price AS service_price,
            services.duration_minutes AS service_duration,
            service_images.image_url AS service_image_url,
            users.first_name AS user_first_name,
            users.last_name AS user_last_name,
            users.email AS user_email,
            users.phone AS user_phone,
            appointments.appointment_date,
            appointments.time_slot,
            appointments.status AS appointment_status
            FROM feedback
            JOIN services ON feedback.service_id = services.service_id
            JOIN users ON feedback.user_id = users.user_id
            JOIN appointments ON feedback.appointment_id = appointments.appointment_id
            LEFT JOIN service_images ON services.service_id = service_images.service_id
        `;
        return res.status(200).json(feedbacks);
    } catch (error) {
        console.error("Error retrieving feedbacks:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//Client can delete a feedback
export const deleteFeedback = async (req, res) => {
    const { feedbackId } = req.params;

    if (!isValidId(feedbackId)) {
        return res.status(400).json({ message: "Invalid feedbackId: must be a positive integer." });
    }

    try {
        const deletedFeedback = await sql`
            DELETE FROM feedback
            WHERE feedback_id = ${feedbackId}
            RETURNING *
        `;

        if (deletedFeedback.length === 0) {
            return res.status(404).json({ message: "Feedback not found for the given feedbackId." });
        }

        console.log("Deleted feedback:", deletedFeedback[0]);
        return res.status(200).json(deletedFeedback[0]);
    } catch (error) {
        console.error("Error deleting feedback:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
