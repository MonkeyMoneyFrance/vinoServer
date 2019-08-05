import React , { useState, useEffect } from 'react';
import {Table,TableBody,TableRow,TableCell,TableHead} from '@material-ui/core';
import {Button,TextField,CssBaseline,Container,Grid,Typography,Paper,ButtonBase,FormControlLabel,Checkbox} from '@material-ui/core';
import { makeStyles , createMuiTheme , responsiveFontSizes} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  textField : {
    margin : 0
  }
}));
function Remarks(props) {
    const [selected, setSelected] = useState([])
    const classes = useStyles();
    // const {players} = props
    return (
        <Grid container >
          <Grid item xs={12} sm={4} >
            <TextField
              className={classes.textField}
              id="standard-multiline-flexible"
              label="Multiline"
              multiline
              rowsMax="4"
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              className={classes.textField}
              id="standard-multiline-flexible"
              label="Multiline"
              multiline
              rowsMax="4"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
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
