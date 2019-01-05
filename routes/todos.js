const moment = require('moment')
const router = require('express').Router()
const Todos = require('./../models/todos')
const _ = require('lodash')

moment.locale();
var update = moment().format('L');
console.log(update)
var myargs = {}

router.get('/', (req, res) => {
    Todos.getAll().then((todos) => res.format({
        'text/html': function(){
            res.render('todos/index', {        
                title: 'Select all',    
                name: 'User 1',    
                todolist: todos,
                myuserid : '1'
            })
        },
        'application/json': function(){
            res.send(todos);
        }
    })).catch((err) => {
      return res.status(404).send(err)
    })
})

router.get('/add',(req, res) => {
    res.format({
        'text/html': function(){
            res.render('todos/form', {        
                title: 'Formulaire ajout',
                name: 'User 1'
            })
    }})
})

router.get('/:id',(req, res) => {
    Todos.findOne(req.params.id).then((todos) => res.format({
        'text/html': function(){
            res.render('todos/show', {        
                title: 'Select One',    
                name: 'User 1',    
                todolist: todos
            })
        },
        'application/json': function(){
            res.send(todos);
        }
    })).catch((err) => {
      return res.status(404).send(err)
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
                res.send(JSON.stringify("{message : 'sucess'}"))
            },
            'text/html': function(){
                res.redirect("/todos")
            }
        })
        }).catch((err) => {
      return res.status(404).send(err)
    })
})

router.patch('/:id', (req, res) => {
    myargs.newcompletion = req.body.newcompletion
    myargs.newmessage = req.body.newmessage
    myargs.id = req.params.id
    myargs.update = update
    Todos.updateOne(myargs).then(() => {
        res.format({
            'application/json': function(){
                res.send(JSON.stringify("{message : 'sucess'}"))
            },
            'text/html': function(){
                res.redirect("/todos")
            }
        })
        }).catch((err) => {
      return res.status(404).send(err)
    })
    
})

router.delete('/:id', (req,res) => {
    Todos.deleteRow(req.params.id).then(() => {
        res.format({
            'application/json': function(){
                res.send(JSON.stringify("{message : 'sucess'}"))
            },
            'text/html': function(){
                res.redirect("/todos")
            }
        })
        }).catch((err) => {
      return res.status(404).send(err)
    })
})

router.get('/:id/edit',(req, res) => {
    id = req.params.id
    Todos.findOne(id).then((todos) =>{
        if(todos.completion == "TODO"){
            todo = true
            done = false
            doing = false
        }else if(todos.completion == "DONE"){
            todo = false
            done = true
            done = false
        }else if(todos.completion == "DOING"){
            todo = false
            done = false
            doing = true
        }
        res.format({
            'text/html': function(){
                res.render('todos/formpatch', {        
                    title: 'Formulaire Maj',    
                    name: 'User 1',
                    mycompletion: todo,
                    mycompletion1: done,
                    mycompletion2: doing,
                    todoslist: todos,
                    usedid : id
                })
            }
        })
    }).catch((err) => {
        return res.status(404).send(err)
    })
})
  
module.exports = router