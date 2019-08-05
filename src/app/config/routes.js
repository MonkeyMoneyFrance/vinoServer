export default  [
  {
    path : '/',
    main: require('../pages/home').default,
    exact:true
  },
  {
    path : '/resetPass',
    main : require('../pages/resetPass').default,
    exact:true
  },
  {
    path : '/confirmMail',
    main : require('../pages/confirmMail').default,
    exact:true
  },
  // {
  //   path : '/game/:gameId',
  //   main: require('../pages/game').default,
  //   private : true,
  //   exact:true
  // },
  // {
  //   path : '/team',
  //   main: require('../pages/team').default,
  //   private : true,
  //   exact:true
  // },
  // {
  //   path : '/profile',
  //   main: require('../pages/profile').default,
  //   private : true,
  //   exact:true
  // },
  //
  // {
  //   path : '/bo/user',
  //   main: require('../pages/user').default,
  //   admin : true,
  // },
  // {
  //   path : '/bo/games',
  //   main: require('../pages/games').default,
  //   admin : true,
  // },
  // {
  //   path : '/bo/game/:gameId',
  //   main: require('../pages/game').default,
  //   admin : true,
  // },
  // {
  //   path : '/bo/teams',
  //   main: require('../pages/teams').default,
  //   admin : true,
  // },
  // {
  //   path : '/bo/teams/:teamId',
  //   main: require('../pages/team').default,
  //   admin : true,
  // },
  // {
  //   path : '/bo/users/',
  //   main: require('../pages/users').default,
  //   admin : true,
  // },
  // {
  //   path : '/bo/users/:userId',
  //   main: require('../pages/user').default,
  //   admin : true,
  // }

]
