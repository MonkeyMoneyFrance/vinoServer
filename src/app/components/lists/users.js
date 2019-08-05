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
const rows = [
  createData('Zizou', "F-00001", "01 02 02 03 02"),
  createData('Deschamps', "F-00002", "01 02 02 03 02"),
  createData('Ronaldo', "F-00003", "01 02 02 03 02"),

];
function createData(name, licence, tel) {
  return { name, licence, tel };
}
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
}));
let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

function Matchs(props) {
    const [selected, setSelected] = useState([])
    const classes = useStyles();

    const handleClick = (value) => {
      props.history.push(`/match/${value}`)
    }

    return (
      <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell align="right">License</TableCell>
                <TableCell align="right">Tel</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow
                  hover
                  onClick={event => handleClick(row.name)}
                  role="checkbox"
                  aria-checked={selected.indexOf(row.name) !== -1}
                  tabIndex={-1}
                  key={row.name}
                  selected={selected.indexOf(row.name) !== -1}
                  >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell selected align="right">{row.licence}</TableCell>
                  <TableCell align="right">{row.tel}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
)
}


export default Matchs;
