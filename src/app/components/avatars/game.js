import React , { useState, useEffect } from 'react';
import {Button,TextField,CssBaseline,Container,Grid,Typography,Paper,ButtonBase,FormControlLabel,Checkbox} from '@material-ui/core';
import { makeStyles , createMuiTheme , responsiveFontSizes} from '@material-ui/core/styles';
import moment from 'moment'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(1),
  },
  infos : {
    padding: theme.spacing(1),
  },
  score : {
    padding : theme.spacing(0,1),
  },
  textField : {
    margin : theme.spacing(1,0),
  }
}));
function MatchAvatar(props) {
    const [selected, setSelected] = useState([])
    const classes = useStyles();
    const {sport,division,category,teams,playedAt} = props
    return (

          <Grid item xs={12} className={classes.root} >
            <Grid container justify='space-between'>
              <Grid item  item xs={6} sm={6}  className={classes.infos}>
                <Grid container justify='flex-start'   >
                  <Typography variant="body2" gutterBottom>
                    Sport : {sport}
                  </Typography>
                </Grid>
                <Grid container justify='flex-start' >
                  <Typography variant="body2" gutterBottom>
                    Division : {division}
                  </Typography>
                </Grid>
                <Grid container justify='flex-start' >
                  <Typography variant="body2" gutterBottom>
                    Categorie : {category}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item  item xs={6} sm={6}  className={classes.infos}>
                <Grid container justify='flex-end' >
                  <Typography variant="body2" gutterBottom>
                    Date : {moment(playedAt).format('DD/MM/YYYY')}
                  </Typography>
                </Grid>
                <Grid container justify='flex-end' >
                  <Typography variant="body2" gutterBottom>
                    Lieu
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Paper >

              <Grid container justify='space-between'>
              <Grid container alignItems='center' justify='center' item xs={12} sm={4} className={classes.infos} >
                <Typography variant="body2" gutterBottom>
                  EQUIPE A
                </Typography>
              </Grid>
              <Grid container alignItems='center' justify='center' item xs={12} sm={4} className={classes.score}>
                <Grid alignItems='center' item sm={5} xs={12}>
                  <TextField
                    fullWidth
                    className={classes.textField}
                    variant="outlined"
                    label="Multiline"
                  />
                </Grid>
                <Grid  justify='center' container xs={12} sm={2}>-</Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    className={classes.textField}
                    label="Multiline"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Grid container alignItems='center' justify='center' item xs={12} sm={4}  className={classes.infos}>
                <Typography  variant="body2" gutterBottom>
                  EQUIPE B
                </Typography>
              </Grid>
              </Grid>
            </Paper>
        </Grid>

)
}


export default MatchAvatar;
