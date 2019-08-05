import React , { useState, useEffect } from 'react';
import {Button,CssBaseline,Container,Grid,Typography,Paper,ButtonBase,FormControlLabel,Checkbox} from '@material-ui/core';
import { makeStyles , createMuiTheme , responsiveFontSizes} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin:'auto'
  },
  img: {
    margin: 'auto',
    display: 'block',
    width: '100%',
    objectFit:'cover',
    height: 100,
  },
  infos : {
    padding: theme.spacing(1)
  }
}));
function UserAvatar(props) {
    const [selected, setSelected] = useState([])
    const classes = useStyles();
    return (
      <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt="complex" src="https://source.unsplash.com/random" />
            </ButtonBase>
          </Grid>
            <Grid xs={12} sm={9} container item direction="column"  >
              <Grid item xs className={classes.infos}>
                <Typography variant="body2" gutterBottom>
                  {props.name}
                </Typography>
                <Typography gutterBottom variant="subtitle1">
                  SPORT : {props.licence}
                </Typography>
              </Grid>
            </Grid>

        </Grid>
      </Paper>
    </div>
)
}


export default UserAvatar;
