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
            SELECT * FROM feedback
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
            SELECT * FROM feedback
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
            SELECT * FROM feedback
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
