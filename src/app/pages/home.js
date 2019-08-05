import React , { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import {Table,TableBody,TableRow,TableCell,TableHead} from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles , createMuiTheme , responsiveFontSizes} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight : 200
  },
}));
function Home() {
    const [selected, setSelected] = useState([])
    const classes = useStyles();
    let theme = createMuiTheme();
    theme = responsiveFontSizes(theme);
    function handleClick(value){
      let newSelected = [...selected]
      let index = newSelected.findIndex(v => v == value)

      index == -1 ? newSelected.push(value) : newSelected.splice(index,1)

      setSelected(newSelected)
    }

    return (
      <Grid container component="main" className={classes.root}>
        <Grid item xs={false} sm={12} md={6} className={classes.image} />
      </Grid>
)
}


export default Home;
