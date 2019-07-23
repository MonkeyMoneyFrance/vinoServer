import React from 'react';
import AdminHeader from "../header/adminHeader";

const AdminLayout = ({ children, ...rest }) => {
    return (
      <div>
        <PrivateHeader />
        {children}
        {/* <Footer /> */}
      </div>
    )
  }

export default AdminLayout;
