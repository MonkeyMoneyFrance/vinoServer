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
    margin : theme.spacing(0,1),
    padding: theme.spacing(0,1),
  },
}));
function Referee(props) {
    const [selected, setSelected] = useState([])
    const classes = useStyles();
    // const {players} = props
    return (
      <Grid>
        <Grid container className={classes.root}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveCard" value="yes" />}
            label="Observation de la recontre"
          />
        </Grid>
        <Grid container className={classes.root}>
          <Typography >Fait par :</Typography>
          <Grid container   >
          <Grid item xs={12} sm={6}>
            <TextField
              style={{flex:1}}
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Equipe"
              type="password"
              id="password"
              // onChange = {(e)=>setPass(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              style={{flex:1}}
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Equipe"
              type="password"
              id="password"
              autoComplete="current-password"
              // onChange = {(e)=>setPass(e.target.value)}
            />
          </Grid>
          </Grid>
        </Grid>
      </Grid>


)
}


export default Referee;
