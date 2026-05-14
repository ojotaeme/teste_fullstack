package com.todobackend.backend.models

data class AuthRequest(val username: String, val password: String)
data class AuthResponse(val token: String)

data class TodoRequest(val title: String, val description: String?)
data class TodoResponse(val id: Long, val title: String, val description: String?, val completed: Boolean)

// Extension function para mapear entidade para DTO e não expor o User
fun Todo.toResponse() = TodoResponse(id, title, description, completed)