import {sql} from '../config/db.js';

//Create an appointment
export const createAppointment = async (req, res) => {
  const { userId, serviceId } = req.params;
  const { appointment_date, slot_time, status } = req.body;

  try {
    // Check if user already has an appointment on the same date
    const existingAppointment = await sql`
      SELECT COUNT(*) AS count 
      FROM appointments
      WHERE user_id = ${userId}
      AND appointment_date = ${appointment_date}
      AND status != 'cancelled'
    `;

    if (parseInt(existingAppointment[0].count) >= 1) {
      return res.status(400).json({
        message: "You already have an appointment for this day. Please cancel it first or choose another date.",
      });
    }

    // Create new appointment
    const newAppointment = await sql`
      INSERT INTO appointments (user_id, service_id, appointment_date, time_slot, status)
      VALUES (${userId}, ${serviceId}, ${appointment_date}, ${slot_time}, 'pending')
      RETURNING *
    `;

    console.log("Created new appointment:", newAppointment[0]);
    res.status(201).json(newAppointment[0]);

  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//Update an appointment
export const updateAppointment = async (req, res) => {
      const { appointmentId, userId, serviceId } = req.params;
      const {  appointment_date, slot_time, status } = req.body;

      const updates = {}; 

  // Only add fields that are explicitly provided (not undefined).
        if (userId !== undefined) updates.user_id = userId;
        if (serviceId !== undefined) updates.service_id = serviceId;
        if (appointment_date !== undefined) updates.appointment_date = appointment_date;
        if(slot_time !== undefined) updates.time_slot = slot_time;
        if (status !== undefined) updates.status = status;

          if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "At least one field is required to update" });
        }

      try {
        const updatedAppointment = await sql`
          UPDATE appointments
          SET ${sql(updates)}
          WHERE appointment_id = ${appointmentId} AND user_id = ${userId} AND service_id = ${serviceId} AND status != 'confirmed'
          RETURNING *
        `;

        if (updatedAppointment.length === 0) {
          return res.status(404).json({ message: "Appointment not found or already confirmed" });
        }

        console.log("Updated appointment:", updatedAppointment[0]);
        res.status(200).json(updatedAppointment[0]);
       
        if (updatedAppointment.length === 0) {
          return res.status(404).json({ message: "Appointment not found" });
        }

        console.log("Updated appointment:", updatedAppointment[0]);
        res.status(200).json(updatedAppointment[0]);
      } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ message: "Internal server error" });
      }
};

//Admin can accept an appointment (set status to confirmed)
export const acceptAppointment = async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const acceptedAppointment = await sql`
            UPDATE appointments
            SET status = 'confirmed'
            WHERE appointment_id = ${appointmentId}
            RETURNING *
        `;

        if (acceptedAppointment.length === 0) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        console.log("Accepted appointment:", acceptedAppointment[0]);
        res.status(200).json(acceptedAppointment[0]);
    } catch (error) {
        console.error("Error accepting appointment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//Admin can reject an appointment (set status to rejected)
export const rejectAppointment = async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const rejectedAppointment = await sql`
            UPDATE appointments
            SET status = 'rejected'
            WHERE appointment_id = ${appointmentId}
            RETURNING *
        `;

        if (rejectedAppointment.length === 0) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        console.log("Rejected appointment:", rejectedAppointment[0]);
        res.status(200).json(rejectedAppointment[0]);
    } catch (error) {
        console.error("Error rejecting appointment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


//User can cancel an appointment if they booked it (set status to cancelled)
export const cancelAppointment = async (req, res) => {
    const { appointmentId, userId } = req.params;

    try {
        const cancelledAppointment = await sql`
            UPDATE appointments
            SET status = 'cancelled'
            WHERE appointment_id = ${appointmentId} AND user_id = ${userId} AND status = 'pending'
            RETURNING *
        `;

        if (cancelledAppointment.length === 0) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        console.log("Cancelled appointment:", cancelledAppointment[0]);
        res.status(200).json(cancelledAppointment[0]);
    } catch (error) {
        console.error("Error cancelling appointment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


//Get appointments by user ID
export const getAppointmentsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const appointments = await sql`
      SELECT 
        appointments.appointment_id,
        appointments.appointment_date,
        appointments.time_slot,
        appointments.status,
        services.service_id,
        services.name AS service_name,
        services.description AS service_description,
        services.price AS service_price,
        services.duration_minutes AS service_duration,
        service_images.image_url AS service_image_url
      FROM appointments
      JOIN services ON appointments.service_id = services.service_id
      LEFT JOIN service_images ON services.service_id = service_images.service_id
      WHERE appointments.user_id = ${userId}
      ORDER BY appointments.appointment_date DESC
    `;

    if (appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found for this client" });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Get all appointments (admin)
export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await sql`
            SELECT
                appointments.appointment_id,
                appointments.user_id,
                appointments.service_id,
                appointments.appointment_date,
                appointments.time_slot,
                appointments.status,
                users.first_name AS user_first_name,
                users.last_name AS user_last_name,
                users.email AS user_email,
                users.phone AS user_phone,
                services.name AS service_name,
                services.description AS service_description,
                services.price AS service_price,
                services.duration_minutes AS service_duration,
                service_images.image_id AS service_image_id,
                service_images.image_url AS service_image_url
            FROM appointments
            JOIN users ON appointments.user_id = users.user_id
            JOIN services ON appointments.service_id = services.service_id
            LEFT JOIN service_images ON services.service_id = service_images.service_id
        `;

        if (appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found" });
        }

        res.status(200).json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//Remove an appointment
export const deleteAppointment = async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const deletedAppointment = await sql`
            DELETE FROM appointments
            WHERE appointment_id = ${appointmentId}
            RETURNING *
        `;

        if (deletedAppointment.length === 0) {
            return res.status(404).json({ message: "Appointment not found or already confirmed" });
        }

        console.log("Deleted appointment:", deletedAppointment[0]);
        res.status(200).json(deletedAppointment[0]);
    } catch (error) {
        console.error("Error deleting appointment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

