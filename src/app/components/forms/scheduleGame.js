import React , { useState, useEffect } from 'react';
import {Table,TableBody,TableRow,TableCell,TableHead} from '@material-ui/core';
import {Button,TextField,CssBaseline,Container,Grid,Typography,Paper,ButtonBase,FormControlLabel,Checkbox} from '@material-ui/core';
import { makeStyles , createMuiTheme , responsiveFontSizes} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
    display:'flex',
    alignItems:'center',
    justifyContent:'flex-start'
  },
  typo : {
    padding: theme.spacing(0,1),
  },
}));
function ScheduleGame(props) {
    const [selected, setSelected] = useState([])
    const classes = useStyles();
    // const {players} = props
    return (
      <Grid container className={classes.root}>
        <Typography className={classes.typo}>Heure du coup d'envoi d'effectif de la recontre</Typography>
        <TextField
          variant="outlined"
          required
          name="password"
          label="Heure de début"
          type="password"
          id="password"
          autoComplete="current-password"
          // onChange = {(e)=>setPass(e.target.value)}
        />

      </Grid>

)
}


export default ScheduleGame;
