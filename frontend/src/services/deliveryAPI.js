// register a new delivery person
export const registerDeliveryPerson = async (formData) => {
  const token = localStorage.getItem("token");

  const payload = {
    name: formData.name,
    vehicaleType: formData.vehicaleType,
    phoneNumber: formData.phoneNumber,
    address: formData.address,
    currentLocation: {
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
    },
  };

  const res = await fetch(
    "http://localhost:5002/api/delivery/delivery-person",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to register delivery person");
  }
  return data;
};

// get delivery person by id
export const getDeliveryPersonById = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `http://localhost:5002/api/delivery/delivery-person/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch delivery person");
  }

  return data;
};

export const updateDeliveryPerson = async (formData) => {
  const token = localStorage.getItem("token");
  const payLoad = {
    name: formData.name,
    vehicaleType: formData.vehicaleType,
    phoneNumber: formData.phoneNumber,
    address: formData.address,
    currentLocation: {
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
    },
  };

  try {
    const res = await fetch(
      `http://localhost:5002/api/delivery/delivery-person/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payLoad),
      }
    );
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to update delivery person");
    }

    // Return the updated data to be used in the component
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// update online status
export const updateOnlineStatus = async (status) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `http://localhost:5002/api/delivery/delivery-person/online-status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isOnline: status }),
    }
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to update online status");
  }
  return data;
};
