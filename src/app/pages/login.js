import React , { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import {CircularProgress} from '@material-ui/core'
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles , createMuiTheme , responsiveFontSizes} from '@material-ui/core/styles';
import {login} from '../utils/API'
import {connect} from 'react-redux'
import {requestFetchUser} from '../redux/actions'
import {bindActionCreators} from 'redux'

function MadeWithLove() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Built with love by the '}
      <Link color="inherit" href="https://material-ui.com/">
        Material-UI
      </Link>
      {' team.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    // height: '100vh',
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

function mapStateToProps(state){
  return {
    user : state.user
  }
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({requestFetchUser}, dispatch)
}

function Login (props) {
    const [email, setMail] = useState();
    const [password, setPass] = useState();

    const classes = useStyles();
    let theme = createMuiTheme();
    theme = responsiveFontSizes(theme);
    function tryLogin(){
      props.requestFetchUser({email,password})
    }
    useEffect(() => {
      if (props.user.authenticated == 'AUTHENTICATED') window.location.href = '/'
    });
    function submitHandler(e) {
        e.preventDefault();
        tryLogin()
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
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={submitHandler} >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange = {(e)=>setMail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange = {(e)=>setPass(e.target.value)}
          />
        <div className={classes.wrapper}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}>
            <CircularProgress className={classes.buttonProgress} />
          </Button>

        </div>

          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
          <Box mt={5}>

          </Box>
        </form>
      </div>
    </Grid>
  </Grid>
)
}
export default connect(mapStateToProps,matchDispatchToProps)(Login)
