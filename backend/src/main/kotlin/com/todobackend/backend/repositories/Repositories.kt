package com.todobackend.backend.repositories

import com.todobackend.backend.models.Todo
import com.todobackend.backend.models.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByUsername(username: String): User?
}

@Repository
interface TodoRepository : JpaRepository<Todo, Long> {
    fun findByUserId(userId: Long): List<Todo>
}