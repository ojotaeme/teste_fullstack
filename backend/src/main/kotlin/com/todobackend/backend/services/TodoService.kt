package com.todobackend.backend.services

import com.todobackend.backend.models.Todo
import com.todobackend.backend.models.TodoRequest
import com.todobackend.backend.repositories.TodoRepository
import com.todobackend.backend.repositories.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class TodoService(
    private val todoRepository: TodoRepository,
    private val userRepository: UserRepository
) {
    fun getTodos(username: String): List<Todo> {
        val user = userRepository.findByUsername(username) ?: throw RuntimeException("User not found")
        return todoRepository.findByUserId(user.id)
    }

    fun createTodo(username: String, request: TodoRequest): Todo {
        val user = userRepository.findByUsername(username) ?: throw RuntimeException("User not found")
        val todo = Todo(title = request.title, description = request.description, user = user)
        return todoRepository.save(todo)
    }

    fun toggleTodo(todoId: Long, username: String): Todo {
        val todo = todoRepository.findById(todoId).orElseThrow { RuntimeException("Todo not found") }
        if (todo.user.username != username) throw RuntimeException("Unauthorized access")

        todo.completed = !todo.completed
        return todoRepository.save(todo)
    }

    fun updateTodo(todoId: Long, username: String, request: TodoRequest): Todo {
        val todo = todoRepository.findById(todoId).orElseThrow { RuntimeException("Todo not found") }
        if (todo.user.username != username) throw RuntimeException("Unauthorized access")

        todo.title = request.title
        todo.description = request.description
        return todoRepository.save(todo)
    }

    fun deleteTodo(todoId: Long, username: String) {
        val todo = todoRepository.findById(todoId).orElseThrow { RuntimeException("Todo not found") }
        if (todo.user.username != username) throw RuntimeException("Unauthorized access")
        todoRepository.delete(todo)
    }
}