// src/pages/AdminServices.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    duration_minutes: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(true);
  
  //   Fetch all servicesd
  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/services/get-services");
      setServices(res.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  //   Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Enforce positive numbers for price and duration
    if ((name === "price" || name === "duration_minutes") && value < 0) return;

    setNewService({ ...newService, [name]: value });
  };

  //   Create new service
  const handleCreateService = async () => {
    if (!newService.name || !newService.description || !newService.price || !newService.duration_minutes) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/services/create-service", newService);
      const created = res.data;

      // Upload image if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        await axios.post(
          `http://localhost:4000/api/services/add-service-image/${created.service_id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      alert("Service created successfully!");
      setNewService({ name: "", description: "", price: "", duration_minutes: "" });
      setSelectedImage(null);
      fetchServices();
    } catch (error) {
      console.error("Error creating service:", error);
      alert("Failed to create service");
    }
  };

  //   Update existing service
  const handleUpdateService = async (serviceId) => {
    try {
      await axios.put(`http://localhost:4000/api/services/update-service/${serviceId}`, editingService);
      alert("Service updated successfully!");
      setEditingService(null);
      fetchServices();
    } catch (error) {
      console.error("Error updating service:", error);
      alert("Failed to update service");
    }
  };

  //   Upload image for existing service
 const handleUploadImage = async (serviceId, file) => {
  if (!file) {
    alert("Please select an image first.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("image", file);

    await axios.post(
      `http://localhost:4000/api/services/add-service-image/${serviceId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    alert("Image uploaded!");
    fetchServices();
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("Failed to upload image");
  }
};


  //   Delete service
  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/services/delete-service/${serviceId}`);
      alert("Service deleted successfully!");
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service");
    }
  };

  //   Delete service image
  const handleDeleteImage = async (imageId) => {
    try {
      await axios.delete(`http://localhost:4000/api/services/delete-service-image/${imageId}`);
      alert("Image deleted successfully!");
      fetchServices();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-rose-50 to-stone-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-stone-200 border-t-rose-500 mb-4"></div>
          <p className="text-stone-600 text-lg">Loading your services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-rose-50 to-stone-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-stone-800 mb-8 text-center" style={{ fontFamily: 'serif' }}>
       Manage Your Beautician Services
        </h1>
        
        {/* Add Service Form */}
        <div className="border border-stone-200 p-6 rounded-2xl bg-stone-50 mb-10 shadow-md">
          <h2 className="text-2xl font-semibold text-stone-700 mb-4">Add New Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={newService.name}
              onChange={handleChange}
              placeholder="Service Name"
              className="border-2 border-stone-200 focus:border-rose-400 focus:outline-none p-3 rounded-xl transition-colors text-stone-800"
            />
            <input
              name="price"
              type="number"
              min={0}
              value={newService.price}
              onChange={handleChange}
              placeholder="Price"
              className="border-2 border-stone-200 focus:border-rose-400 focus:outline-none p-3 rounded-xl transition-colors text-stone-800"
            />
            <input
              name="duration_minutes"
              type="number"
              min={0}
              value={newService.duration_minutes}
              onChange={handleChange}
              placeholder="Duration (minutes)"
              className="border-2 border-stone-200 focus:border-rose-400 focus:outline-none p-3 rounded-xl transition-colors text-stone-800"
            />
            <textarea
              name="description"
              value={newService.description}
              onChange={handleChange}
              placeholder="Description"
              className="border-2 border-stone-200 focus:border-rose-400 focus:outline-none p-3 rounded-xl col-span-full transition-colors text-stone-800 resize-none"
              rows="3"
            />
            <div className="col-span-full">
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Service Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
                className="w-full text-stone-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100 transition duration-300"
              />
            </div>
          </div>
         <button
            onClick={handleCreateService}
            className="w-full bg-gradient-to-r from-stone-300 to-rose-300 text-stone-800 px-6 py-3 rounded-xl font-medium hover:from-stone-400 hover:to-rose-400 transition-all duration-300 shadow-md hover:shadow-lg"
            >
            Create Service
        </button>

        </div>

        {/* Service List */}
        <h2 className="text-2xl font-semibold text-stone-700 mb-6 border-b border-stone-200 pb-2">Existing Services</h2>
        {services.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-stone-200">
            <div className="text-stone-300 text-6xl mb-4">💅</div>
            <h3 className="text-xl font-semibold text-stone-700 mb-2">
              No services created yet
            </h3>
            <p className="text-stone-500">
              Start by adding your first beauty service.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.service_id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-200"
              >
                <div className="p-5">
                  {editingService?.service_id === service.service_id ? (
                    <>
                      {/* Edit Mode */}
                      <input
                        type="text"
                        name="name"
                        value={editingService.name}
                        onChange={(e) =>
                          setEditingService({ ...editingService, name: e.target.value })
                        }
                        placeholder="Service Name"
                        className="w-full border-2 border-stone-200 focus:border-rose-400 rounded-xl p-3 mb-2 focus:outline-none transition-colors text-lg font-semibold text-stone-800"
                      />
                      <textarea
                        name="description"
                        value={editingService.description}
                        onChange={(e) =>
                          setEditingService({ ...editingService, description: e.target.value })
                        }
                        placeholder="Description"
                        className="w-full border-2 border-stone-200 focus:border-rose-400 rounded-xl p-3 mb-2 focus:outline-none transition-colors text-stone-700 resize-none"
                        rows="2"
                      />
                      <input
                        type="number"
                        name="price"
                        min={0}
                        value={editingService.price}
                        onChange={(e) =>
                          setEditingService({ ...editingService, price: e.target.value })
                        }
                        placeholder="Price"
                        className="w-full border-2 border-stone-200 focus:border-rose-400 rounded-xl p-3 mb-2 focus:outline-none transition-colors text-stone-800"
                      />
                      <input
                        type="number"
                        name="duration_minutes"
                        min={0}
                        value={editingService.duration_minutes}
                        onChange={(e) =>
                          setEditingService({ ...editingService, duration_minutes: e.target.value })
                        }
                        placeholder="Duration (minutes)"
                        className="w-full border-2 border-stone-200 focus:border-rose-400 rounded-xl p-3 mb-4 focus:outline-none transition-colors text-stone-800"
                      />
                      {/*}
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                          Upload New Image
                        </label>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setEditSelectedImage(e.target.files[0])}
                          className="w-full text-stone-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl
                                    file:border-0 file:text-sm file:font-semibold file:bg-rose-50
                                    file:text-rose-600 hover:file:bg-rose-100 transition duration-300"
                        />

                        {editSelectedImage && (
                          <button
                            onClick={() => handleUploadImage(service.service_id)}
                            className="mt-2 bg-gradient-to-r from-stone-300 to-rose-300 text-stone-800 
                                      px-4 py-2 rounded-xl hover:from-stone-400 hover:to-rose-400
                                      transition shadow-md hover:shadow-lg"
                          >
                            Upload Image
                          </button>
                        )}
                      </div>*/}

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdateService(service.service_id)}
                           className="flex-1 bg-gradient-to-r from-stone-300 to-rose-300 text-stone-800 px-6 py-3 rounded-xl font-medium hover:from-stone-400 hover:to-rose-400 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingService(null)}
                          className="flex-1 bg-gradient-to-r from-stone-300 to-rose-300 text-stone-800 px-6 py-3 rounded-xl font-medium hover:from-stone-400 hover:to-rose-400 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* View Mode */}
                     {(!service.images || service.images.length === 0) ? (
                          <div className="relative mb-3 flex flex-col items-center justify-center bg-stone-100 border border-stone-300 rounded-xl h-48">
                            <p className="text-stone-500 mb-2">No Image</p>

                            {/* Upload button when NO image */}
                            <label className="cursor-pointer bg-rose-200 text-stone-800 px-3 py-2 rounded-lg hover:bg-rose-300 transition">
                              Upload Image
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  handleUploadImage(service.service_id, file);
                                }}
                              />
                            </label>
                          </div>
                        ) : (
                          service.images.map((img) => (
                            <div key={img.image_id} className="relative mb-3">
                              <img
                                src={`http://localhost:4000${img.image_url}`}
                                alt={service.name}
                                className="w-full h-48 object-cover rounded-xl shadow-inner"
                              />

                              <button
                                onClick={() => handleDeleteImage(img.image_id)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 text-xs hover:bg-red-600 transition"
                              >
                                🗑
                              </button>
                            </div>
                          ))
                        )}

                      <h3 className="font-bold text-xl text-rose-600 mb-1">{service.name}</h3>
                      <p className="text-stone-600 mb-2">{service.description}</p>
                      <p className="text-stone-800 font-semibold mb-1">Price: R{service.price}</p>
                      <p className="text-stone-500 text-sm mb-4">
                        Duration: **{service.duration_minutes} min**
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setEditingService(service)}
                           className="flex-1 bg-gradient-to-r from-stone-300 to-rose-300 text-stone-800 px-6 py-3 rounded-xl font-medium hover:from-stone-400 hover:to-rose-400 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                           Edit
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.service_id)}
                           className="flex-1 bg-gradient-to-r from-stone-300 to-rose-300 text-stone-800 px-6 py-3 rounded-xl font-medium hover:from-stone-400 hover:to-rose-400 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServices;