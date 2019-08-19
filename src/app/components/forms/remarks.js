import React , { useState, useEffect } from 'react';
import {Table,TableBody,TableRow,TableCell,TableHead} from '@material-ui/core';
import {Button,TextField,CssBaseline,Container,Grid,Typography,Paper,ButtonBase,FormControlLabel,Checkbox} from '@material-ui/core';
import { makeStyles , createMuiTheme , responsiveFontSizes} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0,1),
  },
  textField : {
    margin : theme.spacing(1,0),
  }
}));
function Remarks(props) {
    const [selected, setSelected] = useState([])
    const classes = useStyles();
    // const {players} = props
    return (
        <Grid className={classes.root}>
          <Grid  >
            <TextField
              fullWidth
              className={classes.textField}
              id="standard-multiline-flexible"
              label="Multiline"
              multiline
              rowsMax="4"
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              className={classes.textField}
              id="standard-multiline-flexible"
              label="Multiline"
              multiline
              rowsMax="4"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              className={classes.textField}
              id="standard-multiline-flexible"
              label="Multiline"
              multiline
              rowsMax="4"
              variant="outlined"
              fullWidth
            />
          </Grid>
        </Grid>


)
}


export default Remarks;
