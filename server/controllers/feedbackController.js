import {sql} from '../config/db.js';

//Create a feedback for a service by a user
export const createFeedback = async (req, res) => {
      const { appointmentId, userId, serviceId } = req.params;
      const { rating, comment } = req.body;

      try {

          const existingAppointment = await sql`
                SELECT * FROM appointments
                WHERE appointment_id = ${appointmentId} AND user_id = ${userId} AND service_id = ${serviceId} 
                AND status = 'confirmed'
          `;

          if (existingAppointment.length === 0) {
              return res.status(404).json({ message: "Feedback for a service can only be created if the appointment exists and is confirmed." });
          }

          const newFeedback = await sql`
              INSERT INTO feedback (appointment_id, user_id, service_id, rating, comment)
              VALUES (${appointmentId}, ${userId}, ${serviceId}, ${rating}, ${comment})
              RETURNING *
          `;

          console.log("Created new feedback:", newFeedback[0]);
          res.status(201).json(newFeedback[0]);
      } catch (error) {
          console.error("Error creating feedback:", error);
          res.status(500).json({ message: "Internal server error" });
      }
};


//Update a feedback
export const updateFeedback = async (req, res) => {
      const { feedbackId, userId, serviceId } = req.params;
      const { rating, comment } = req.body;

      const updates = {}; 

  // Only add fields that are explicitly provided (not undefined).
        if (rating !== undefined) updates.rating = rating;
        if (comment !== undefined) updates.comment = comment;
        
            if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "At least one field is required to update" });
    }

      try {
          const updatedFeedback = await sql`
              UPDATE feedback
              SET ${sql(updates)}
              WHERE feedback_id = ${feedbackId} AND user_id = ${userId} AND service_id = ${serviceId}
              RETURNING *
          `;

          if (updatedFeedback.length === 0) {
              return res.status(404).json({ message: "Feedback not found" });
          }

          console.log("Updated feedback:", updatedFeedback[0]);
          res.status(200).json(updatedFeedback[0]);
      } catch (error) {
          console.error("Error updating feedback:", error);
          res.status(500).json({ message: "Internal server error" });
      }
};

//Get feedbacks for a service
export const getFeedbacksByServiceId = async (req, res) => {
    const { serviceId } = req.params; 

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
            WHERE service_id = ${serviceId}
        `;

        if (feedbacks.length === 0) {
            return res.status(404).json({ message: "No feedback found for this service" });
        }

        console.log("Retrieved feedbacks:", feedbacks);
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error("Error retrieving feedbacks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//Get feedbacks by user ID
export const getFeedbacksByUserId = async (req, res) => {
    const { userId } = req.params;

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
            WHERE user_id = ${userId}
        `;

        if (feedbacks.length === 0) {
            return res.status(404).json({ message: "No feedback found for this user" });
        }

        console.log("Retrieved feedbacks:", feedbacks);
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error("Error retrieving feedbacks:", error);
        res.status(500).json({ message: "Internal server error" });
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
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error("Error retrieving feedbacks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//Admin can delete a feedback
export const deleteFeedback = async (req, res) => {
    const { feedbackId } = req.params;

    try {
        const deletedFeedback = await sql`
            DELETE FROM feedback
            WHERE feedback_id = ${feedbackId}
            RETURNING *
        `;

        if (deletedFeedback.length === 0) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        console.log("Deleted feedback:", deletedFeedback[0]);
        res.status(200).json(deletedFeedback[0]);
    } catch (error) {
        console.error("Error deleting feedback:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
