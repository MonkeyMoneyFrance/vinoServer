import React , { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import {CircularProgress} from '@material-ui/core'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles , createMuiTheme , responsiveFontSizes} from '@material-ui/core/styles';
import {connect} from 'react-redux'
const URL = (process.env.NODE_ENV == 'production') ? '' : "http://localhost:3000"
const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent:'center',
    alignItems: 'center',
    padding : '1em',
    height:'100%'
  },
}))

function ConfirmMail (props) {
    const [message, setMessage] = useState('Confirmation de votre email');
    const [isLoading, setLoad] = useState(true);

    const classes = useStyles();
    let theme = createMuiTheme();
    theme = responsiveFontSizes(theme);

    const confirmMail = () => {
      const params = (props.location.search.match( new RegExp("([^?=&]+)(=([^&]*))?", 'g' )) || [])
    	.reduce((result, each) =>
    	{
    		let[ key, value ] = each.split( '=' );
    		result[ key ] = value;
    		return ( result );
    	}, {});

      const options = {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(params),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }
      console.log(options)
      fetch(URL + '/api/confirmMail', options).then(async (res)=>{

          let text = await res.text()

            setMessage(text)
            setLoad(false)




      })
    }

    useEffect(()=>confirmMail(),[])
    return (
      <Grid container component="main" className={classes.root}>
        <Grid item xs={12} sm={12} md={12} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              {message}
            </Typography>
              {isLoading && <CircularProgress className={classes.buttonProgress} />}
          </div>
        </Grid>
      </Grid>
      )
    }
export default ConfirmMail
