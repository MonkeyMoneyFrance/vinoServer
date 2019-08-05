import React from 'react';
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles';
import PrivateHeader from "../header/privateHeader";
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
  },
}));
const PrivateLayout = ({ children, ...rest }) => {
    const classes = useStyles();
    return (
      <div >
        <PrivateHeader />
          <Container component="main" maxWidth={'lg'} className={classes.root}>
            {children}
          </Container>
        {/* <Footer /> */}
      </div>
    )
  }

export default PrivateLayout;
