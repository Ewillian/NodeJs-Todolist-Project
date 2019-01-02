const moment = require('moment')
const pug = require('pug');
const router = require('express').Router()
const Todos = require('./../models/todos')
const _ = require('lodash')

var my404 = {status: "404 not found"}

moment.locale();
var update = moment().format('L');
console.log(update)
var myargs = {}

router.get('/', (req, res) => {
    Todos.getAll().then((todos) => res.format({
        'text/html': function(){
            res.render('todos/index', {        
                title: 'Select all',    
                name: 'User',    
                todolist: todos
            })
        },
        'application/json': function(){
            res.send(todos);
        }
    })).catch((err) => {
      return res.status(404).send(my404+err)
    })
})

router.get('/add',(req, res) => {
    res.format({
        'text/html': function(){
            res.render('todos/form', {        
                title: 'Formulaire ajout',
                name: 'User'
            })
    }})
})

router.get('/:id',(req, res) => {
    Todos.findOne(req.params.id).then((todos) => res.format({
        'text/html': function(){
            res.render('todos/show', {        
                title: 'Select One',    
                name: 'User',    
                todolist: todos
            })
        },
        'application/json': function(){
            res.send(todos);
        }
    })).catch((err) => {
      return res.status(404).send(my404+err)
    })
})

router.post('/',(req, res) => {
    myargs.message = req.body.message
    myargs.completion = req.body.completion
    myargs.userId = 1
    myargs.update = update
    Todos.postOne(myargs).then(() => {
        res.format({
            'application/json': function(){
                res.send("{message : 'sucess'}");
            },
            'text/html': function(){
                res.redirect("/todos")
            }
        })
        }).catch((err) => {
      return res.status(404).send(my404+err)
    })
})

router.patch('/:id', (req, res) => {
    console.log(req.body.id)
    myargs.newcompletion = req.body.newcompletion
    myargs.newmessage = req.body.newmessage
    myargs.id = req.params.id
    myargs.update = update
    Todos.updateOne(myargs).then(() => {
        res.format({
            'application/json': function(){
                res.send("{message : 'sucess'}");
            },
            'text/html': function(){
                res.redirect("/todos")
            }
        })
        }).catch((err) => {
      return res.status(404).send(my404+err)
    })
    
})

router.delete('/:id', (req,res) => {
    Todos.deleteRow(req.params.id).then(() => {
        res.format({
            'application/json': function(){
                res.send("{message : 'sucess'}")
            }
        })
        res.redirect("/todos")
        }).catch((err) => {
      return res.status(404).send(my404+err)
    })
})

router.get('/:id/edit',(req, res) => {
    id = req.params.id
    Todos.findOne(id).then((todos) =>{
        if(todos.completion == "TODO"){
            mc = true
            mc1 = false
        }else if(todos.completion == "DONE"){
            mc = false
            mc1 = true
        }
        res.format({
            'text/html': function(){
                res.render('todos/formpatch', {        
                    title: 'Formulaire Maj',    
                    name: 'User',
                    mycompletion: mc,
                    mycompletion1: mc1,
                    todoslist: todos,
                    usedid : id
                })
            }
        })
    }).catch((err) => {
        return res.status(404).send(my404+err)
    })
})

router.get('/users/:id/todos',(req, res) => {
    res.format({
        'text/html': function(){
            res.render('ressources/show', {        
                title: 'Bonjour !',    
                name: 'User',
                todolist: todos,
            })
        }
    })
})

router.use((req, res) => {
    res.format({
        'application/json': function(){
            res.status(404)
          },
        'text/html': function(){
            res.render('todos/index', {        
                title: '404 !',    
                name: '404',    
            });
          }
    })
})

router.use((req, res) => {
    res.status(404)
    res.send('404 NOT FOUND')
})
  
module.exports = router