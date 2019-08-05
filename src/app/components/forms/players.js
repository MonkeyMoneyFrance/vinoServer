import React , { useState, useEffect } from 'react';
import MaterialTable from 'material-table'
import {Table,TableBody,TableRow,TableCell,TableHead} from '@material-ui/core';
import {Button,CssBaseline,Container,Grid,Typography,Paper,ButtonBase,FormControlLabel,Checkbox} from '@material-ui/core';
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
    marginTop: theme.spacing(1),
  },
  infos : {
    padding: theme.spacing(1)
  },
  submit : {
    display : 'flex',
    margin:'0.5em auto',

  }
}));
function Players(props) {
    const [data, setData] = useState([
      { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
      { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
    ])
    const classes = useStyles();
    const columns =  [
  {
    title: 'Name', field: 'name',
    editComponent: props => (
      <input
        type="text"
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    )
      },
      { title: 'Surname', field: 'surname' },
      { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
      {
        title: 'Birth Place',
        field: 'birthCity',
        lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
      },
    ]
    return (
      <Grid>
        <MaterialTable
        title="Custom Edit Component Preview"
        columns={columns}
        data={data}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                  let oldData = [...data];
                  oldData.push(newData);
                  this.setData({ oldData }, () => resolve());
                }
                resolve()
              }, 1000)
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                  let data = [...data];
                  const index = data.indexOf(oldData);
                  data[index] = newData;
                  this.setData({ data }, () => resolve());
                }
                resolve()
              }, 1000)
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                  let data = [...data];
                  const index = data.indexOf(oldData);
                  data.splice(index, 1);
                  this.setData({ data }, () => resolve());
                }
                resolve()
              }, 1000)
            }),
        }}
      />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.submit}>
          Ajouter un joueur
        </Button>
      </Grid>

)
}


export default Players;
