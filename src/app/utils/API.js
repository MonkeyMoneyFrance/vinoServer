import axios from 'axios'
const headers = {
    'Content-Type': 'application/json'
}
const URL = process.env.NODE_ENV == 'production' ? '' : "http://localhost:3000"
var token;
// var _this = this;

function login(email='geoffroymounier@gmail.com',password='France98') {
  return new Promise((resolve,reject) => {
    request('POST','/login',{email,password},{email,password})
    .then(() => resolve())
    .catch((e)=>reject(e))
  })
}

function isAuth() {
    return (localStorage.getItem('token') !== null);
}

function request(method = 'GET',path,query = {},body){
    return new Promise((resolve,reject) => {
      let queryString = ''
      Object.keys(query).map((param , i) => queryString += (i == 0 ? "?" : "&") + `${param}=${query[param]}` )
      fetch(URL+path+queryString,{
        method,
        body : body ? JSON.stringify(body) || "" : null,
        headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
       },
        credentials: 'include',

      }).then((res)=>{
        switch (res.status){
          case 200 :
            return res.json()
          break;
          default :
            reject('Error somehow')
            break;
        }
      }).then((json)=>{
        console.log(json)
        resolve(json)
      }).catch((e)=>reject(e))
    })
  }

export {login,request,isAuth}
