import {sql} from '../config/db.js';

//Create a service
  export const createService = async (req, res) => {
        const { 
          name, 
          description, 
          price, 
          duration_minutes 
        } = req.body;
        try {
          const newService = await sql`
            INSERT INTO services (name, description, price, duration_minutes)
            VALUES (${name}, ${description}, ${price}, ${duration_minutes})
            RETURNING *
          `;

          console.log("Created new service:", newService[0]);
          res.status(201).json(newService[0]);
            
        } catch (error) {
          console.error("Error creating service:", error);
          res.status(500).json({ message: "Internal server error" });
        }
      
  };

 //Update a service
    export const updateService = async (req, res) => {
      const { serviceId } = req.params;
      const { name, description, price, duration_minutes } = req.body;
      
  const updates = {}; 

  // Only add fields that are explicitly provided (not undefined).
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (price !== undefined) updates.price = price;
  if (duration_minutes !== undefined) updates.duration_minutes = duration_minutes;

        if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "At least one field is required to update" });
    }
    
      try {
        const updatedService = await sql`
          UPDATE services
          SET ${sql(updates)}
          WHERE service_id = ${serviceId}
         RETURNING *
        `;

        if (updatedService.length === 0) {
          return res.status(404).json({ message: "Service not found" });
        }

        console.log("Updated service:", updatedService[0]);
        res.status(200).json(updatedService[0]);

      } catch (error) {
        console.error("Error updating service:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    };

    //Add images to a service
   export const addServiceImage = async (req, res) => {
    const { serviceId } = req.params;

    let image_url;

    // If a file is uploaded, use its path
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }
    // If an image URL is provided, use it
    else if (req.body.image_url) {
      image_url = req.body.image_url;
    }
    // No image provided
    else {
      return res.status(400).json({ message: "No image provided" });
    }

    try {
      const newImage = await sql`
        INSERT INTO service_images (service_id, image_url)
        VALUES (${serviceId}, ${image_url})
        RETURNING *
      `;
      res.status(201).json(newImage[0]);
    } catch (error) {
      console.error("Error adding service image:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };


    //Remove image from a service
    export const deleteServiceImage = async (req, res) => {
      const { imageId } = req.params;

      try {
        const deletedImage = await sql`
          DELETE FROM service_images
          WHERE image_id = ${imageId}
          RETURNING *
        `;

        if (deletedImage.length === 0) {
          return res.status(404).json({ message: "Image not found" });
        }

        console.log("Deleted service image:", deletedImage[0]);
        res.status(200).json(deletedImage[0]);
      } catch (error) {
        console.error("Error deleting service image:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    };

    //Get service by ID
    export const getServiceById = async (req, res) => {
      const { serviceId } = req.params;

      try {
        const service = await sql`
          SELECT * FROM services
          WHERE service_id = ${serviceId}
        `;

        if (service.length === 0) {
          return res.status(404).json({ message: "Service not found" });
        }

        console.log("Retrieved service:", service[0]);
        res.status(200).json(service[0]);
      } catch (error) {
        console.error("Error retrieving service:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    };

    
  //Get all services
 export const getAllServices = async (req, res) => {
  try {
    const services = await sql`
      SELECT 
        services.service_id,
        services.name,
        services.description,
        services.price,
        services.duration_minutes,
        COALESCE(
          json_agg(
            json_build_object(
              'image_id', service_images.image_id,
              'image_url', service_images.image_url
            )
          ) FILTER (WHERE service_images.image_id IS NOT NULL), '[]'
        ) AS images
      FROM services
      LEFT JOIN service_images ON services.service_id = service_images.service_id
      GROUP BY services.service_id
    `;

    console.log("Retrieved all services:", services);
    res.status(200).json(services);
  } catch (error) {
    console.error("Error retrieving services:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



  //Remove a service
  export const deleteService = async (req, res) => {
    const { serviceId } = req.params;

    try {
      const deletedService = await sql`
        DELETE FROM services
        WHERE service_id = ${serviceId}
        RETURNING *
      `;

      if (deletedService.length === 0) {
        return res.status(404).json({ message: "Service not found" });
      }

      console.log("Deleted service:", deletedService[0]);
      res.status(200).json(deletedService[0]);
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
