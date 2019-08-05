import React , { useState, useEffect } from 'react';
import {Button,CssBaseline,Container,Grid,Typography,Paper,ButtonBase,FormControlLabel,Checkbox} from '@material-ui/core';

import { makeStyles , createMuiTheme , responsiveFontSizes} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(1),
    display: 'flex',
    width:"100%",
    flexDirection: 'column',
    alignItems: 'center',
    margin:'auto'
  },
  img: {
    margin: 'auto',
    display: 'block',
    width: '100%',
    objectFit:'cover',
    height: 200,
  },
  infos : {
    padding: theme.spacing(1)
  }
}));
function TeamAvatar(props) {
    const [selected, setSelected] = useState([])
    const classes = useStyles();
    return (
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
                <Typography gutterBottom variant="subtitle1">
                  DIVISION : {props.division}
                </Typography>
              </Grid>
            </Grid>
        </Grid>
      </Paper>
)
}


export default TeamAvatar;
