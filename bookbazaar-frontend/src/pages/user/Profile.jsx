import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mt-5">
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Role:</strong> {user?.role}</p>
      <p><strong>Wallet Balance:</strong> ₹{user?.walletBalance?.toFixed(2)}</p>
    </div>
  );
};

export default Profile;
