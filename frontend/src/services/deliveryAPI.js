// register a new delivery person
export const registerDeliveryPerson = async (formData) => {
  const token = localStorage.getItem("token");

  const payload = {
    name: formData.name,
    vehicaleType: formData.vehicaleType,
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
