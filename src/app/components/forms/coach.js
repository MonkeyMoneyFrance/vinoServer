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
  textField : {
    margin : theme.spacing(1,0),
    '&.inactive fieldset' : {
      border : "none"
    }
  }
}));
function Coach(props) {
    const [selected, setSelected] = useState([])
    const classes = useStyles();
    // const {players} = props
    return (
      <Grid>
        <Grid container className={classes.root}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveCard" value="yes" />}
            label="Coach"
          />
        </Grid>
        <Grid container className={classes.root}>
        <Typography >Fait par :</Typography>
        <Grid container   >
          <Grid item xs={12} sm={6}>
            <TextField

              className={classes.textField + ' inactive'}
              variant="outlined"
              required
              readOnly
              fullWidth
              name="password"
              label="Equipe"
              id="password"

              // onChange = {(e)=>setPass(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
          <TextField

            className={classes.textField}
            variant="outlined"
            required
            fullWidth
            name="password"
            label="Nom"
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


export default Coach;
