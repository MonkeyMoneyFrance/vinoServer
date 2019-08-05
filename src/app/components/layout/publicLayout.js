import React from 'react';
import PublicHeader from "../header/publicHeader";

const PublicLayout = ({ children, ...rest }) => {
    return (
      <div>
        <PublicHeader />
          {children}
        {/* <Footer /> */}
      </div>
    )
  }

export default PublicLayout;
