import React from 'react';
import PrivateHeader from "../header/privateHeader";

const PrivateLayout = ({ children, ...rest }) => {
    return (
      <div>
        <PrivateHeader />
        {children}
        {/* <Footer /> */}
      </div>
    )
  }

export default PrivateLayout;
