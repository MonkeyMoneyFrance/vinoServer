import React from 'react';
import AdminHeader from "../header/adminHeader";

const AdminLayout = ({ children, ...rest }) => {
    return (
      <div>
        <AdminHeader />
        {children}
        {/* <Footer /> */}
      </div>
    )
  }

export default AdminLayout;
