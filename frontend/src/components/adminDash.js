import AdminSidebar from "./Shared/AdminSidebar";

function AdminDash() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Admin Dashboard</h2>
          <p className="text-gray-600 mb-6">
            Welcome, Admin! You can manage users, verify restaurants, and handle financial operations.
          </p>
          <button
            onClick={handleLogout}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-300 font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDash;