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
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {requestFetchGame} from '../../redux/actions'
import { makeStyles , createMuiTheme , responsiveFontSizes} from '@material-ui/core/styles';
const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];
function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
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
function mapStateToProps(state) {
  return {
    games : state.games
  }
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({requestFetchGame}, dispatch)
}
function GamesList(props) {
    const [selected, setSelected] = useState([])
    const classes = useStyles();

    const handleClick = (value) => {
      props.history.push(`/game/${value}`)
    }
    useEffect(() => () => {
        console.log('will unmount');
      }
    , []);
    useEffect(()=>{
      !props.games ? props.requestFetchGame() : void 0
    },[])

    return (
      <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell >Equipe A</TableCell>
                <TableCell >Résultat</TableCell>
                <TableCell >Equipe B</TableCell>
                <TableCell >Statut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(props.games||[]).map(row => (
                <TableRow
                  hover
                  onClick={event => handleClick(row._id)}
                  // aria-checked={selected.indexOf(row.name) !== -1}
                  key={row.playedAt}
                  // selected={selected.indexOf(row.name) !== -1}
                  >
                  <TableCell>{row.playedAt}</TableCell>
                  <TableCell>{(row.teams[0]||{}).teamId}</TableCell>
                  <TableCell >{(row.teams[0]||{}).result} - {(row.teams[1]||{}).result}</TableCell>
                  <TableCell >{(row.teams[1]||{}).teamId}</TableCell>
                  <TableCell >{"Non Joué"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
)
}


export default connect(mapStateToProps,matchDispatchToProps)(GamesList);
