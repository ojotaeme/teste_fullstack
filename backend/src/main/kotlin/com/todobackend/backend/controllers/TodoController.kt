package com.todobackend.backend.controllers

import com.todobackend.backend.models.TodoRequest
import com.todobackend.backend.models.TodoResponse
import com.todobackend.backend.models.toResponse
import com.todobackend.backend.services.TodoService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
@RequestMapping("/api/todos")
class TodoController(private val todoService: TodoService) {

    @GetMapping
    fun getAll(principal: Principal): ResponseEntity<List<TodoResponse>> {
        val todos = todoService.getTodos(principal.name).map { it.toResponse() }
        return ResponseEntity.ok(todos)
    }

    @PostMapping
    fun create(@RequestBody request: TodoRequest, principal: Principal): ResponseEntity<TodoResponse> {
        val todo = todoService.createTodo(principal.name, request)
        return ResponseEntity.ok(todo.toResponse())
    }

    @PutMapping("/{id}/toggle")
    fun toggle(@PathVariable id: Long, principal: Principal): ResponseEntity<TodoResponse> {
        val todo = todoService.toggleTodo(id, principal.name)
        return ResponseEntity.ok(todo.toResponse())
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody request: TodoRequest, principal: Principal): ResponseEntity<TodoResponse> {
        val todo = todoService.updateTodo(id, principal.name, request)
        return ResponseEntity.ok(todo.toResponse())
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long, principal: Principal): ResponseEntity<Void> {
        todoService.deleteTodo(id, principal.name)
        return ResponseEntity.noContent().build()
    }
}