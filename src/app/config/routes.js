export default  [
  {
    path : '/',
    main: require('../pages/home').default,
    private : false,
    exact:true
  },
  {
    path : '/login',
    main : require('../pages/login').default,
    private : false,
    exact:true
  },
  {
    path : '/myspace',
    main : require('../pages/signup').default,
    private : true,
    exact:true
  },
  {
    path : '/bo/matchs/:sport',
    main: require('../pages/signup').default,
    admin : true,
    exact:true
  },
  {
    path : '/bo/teams/:sport',
    main: require('../pages/signup').default,
    admin : true,
    exact:true
  },
  {
    path : '/bo/users/:sport/:team?',
    main: require('../pages/signup').default,
    admin : true,
    exact:true
  }

]
