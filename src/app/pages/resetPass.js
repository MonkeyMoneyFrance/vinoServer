import React , { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import {CircularProgress} from '@material-ui/core'
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles , createMuiTheme , responsiveFontSizes} from '@material-ui/core/styles';
import {connect} from 'react-redux'
const URL = (process.env.NODE_ENV == 'production') ? '' : "http://localhost:3000/"

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight : 200
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding : '1em'
  },
  avatar: {
    margin: 30,
    backgroundColor: 'blue',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
  },
  submit: {
  },
  buttonProgress: {
    color : 'green'
    // position: 'absolute',
    // top: '50%',
    // left: '50%',
    // marginTop: -12,
    // marginLeft: -12,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
}))

function ResetPass (props) {
    const [credentials, setCredentials] = useState({password:'',passwordconfirm:''});
    const [isLoading, setLoad] = useState(false);

    const classes = useStyles();
    let theme = createMuiTheme();
    theme = responsiveFontSizes(theme);

    const resetPass = () => {
      const params = (props.location.search.match( new RegExp("([^?=&]+)(=([^&]*))?", 'g' )) || [])
    	.reduce((result, each) =>
    	{
    		let[ key, value ] = each.split( '=' );
    		result[ key ] = value;
    		( result );
    	}, {});

      const options = {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({...credentials,token:params.token}),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }
      // fetch(URL + 'resetPass', options)
    }
    const onChange = (e) => {
      setCredentials({...credentials, [e.target.id] : e.target.value})
    }
    const testPassword = (pass) => {
      return (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/).test(pass)
    }
    const submitHandler = (e) => {
        e.preventDefault();
        if (!testPassword(credentials.password)) return alert('Le mot de passe doit comporter 1 minuscule, 1 majuscule, et faire 8 caractères de long')
        if (credentials.password !== credentials.passwordconfirm) return alert("Les Mots de passes sont différents")
        setLoad(true)
        resetPass()
    }
    return (
      <Grid container component="main" className={classes.root}>
        <Grid item xs={false} sm={12} md={6} className={classes.image} />
        <Grid item xs={12} sm={12} md={6} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Modifier votre mot de passe
            </Typography>
            <form className={classes.form} noValidate onSubmit={submitHandler} >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                error = {!!credentials.password && !testPassword(credentials.password)}
                name="password"
                label="Nouveau mot de passe"
                type="password"
                id="password"
                onChange = {onChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                error = {!!credentials.passwordconfirm && credentials.passwordconfirm !== credentials.password}
                fullWidth
                name="passwordconfirm"
                label="Confirmer le nouveau mot de passe"
                type="password"
                id="passwordconfirm"
                onChange = {onChange}
              />
            <div className={classes.wrapper}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}>
                {isLoading ? <CircularProgress className={classes.buttonProgress} /> : "Valider" }
              </Button>

            </div>


            </form>
          </div>
        </Grid>
      </Grid>
      )
    }
export default ResetPass
