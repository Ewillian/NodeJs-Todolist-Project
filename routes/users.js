const moment = require('moment')
const router = require('express').Router()
const Todos = require('./../models/todos')
const _ = require('lodash')

var my404 = {status: "404 not found"}

moment.locale();

router.get('/:id/todos', (req, res) => {
    userId = req.params.id
    Todos.getUserTodos(userId).then((todos) => res.format({
        'text/html': function(){
            res.render('todos/index', {        
                title: 'Select userId todos',    
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

module.exports = router