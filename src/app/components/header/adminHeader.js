import React , {useEffect,useState} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import StarIcon from '@material-ui/icons/StarBorder';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { Link as LinkRouter } from 'react-router-dom';
import {connect} from 'react-redux'

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
    ul: {
      margin: 0,
      padding: 0,
    },
    li: {
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[200],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}));

function AdminHeader() {
    const classes = useStyles();
        return (
          <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
              <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                <LinkRouter to='/'>FSGT</LinkRouter>
              </Typography>
              <nav>
                <Link variant="button" color="textPrimary"  className={classes.link}>
                  <LinkRouter to='/bo/teams/foot' >Equipes</LinkRouter>
                </Link>


                <Link variant="button" color="textPrimary" className={classes.link}>
                  <LinkRouter to='/bo/users/foot' >Joueurs</LinkRouter>
                </Link>
                <Link variant="button" color="textPrimary"  className={classes.link}>
                  <LinkRouter to='/bo/games/foot' >Matchs</LinkRouter>
                </Link>
              </nav>

                <Button color="primary" variant="outlined" className={classes.link}>
                  <LinkRouter to='/'>Changer de Sport</LinkRouter>
                </Button>

            </Toolbar>
            </AppBar>

        )
}

export default AdminHeader;
