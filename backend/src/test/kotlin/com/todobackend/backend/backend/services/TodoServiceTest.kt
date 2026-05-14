package com.todobackend.backend.services

import com.todobackend.backend.models.Todo
import com.todobackend.backend.models.TodoRequest
import com.todobackend.backend.models.User
import com.todobackend.backend.repositories.TodoRepository
import com.todobackend.backend.repositories.UserRepository
import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import java.util.*

@ExtendWith(MockKExtension::class)
class TodoServiceTest {

    @MockK
    private lateinit var todoRepository: TodoRepository

    @MockK
    private lateinit var userRepository: UserRepository

    @InjectMockKs
    private lateinit var todoService: TodoService

    @Test
    fun `should create todo successfully`() {
        val username = "joao"
        val user = User(id = 1, username = username, password = "hashed_password")
        val request = TodoRequest(title = "Estudar Kotlin", description = null)
        val todo = Todo(id = 1, title = request.title, user = user)

        every { userRepository.findByUsername(username) } returns user
        every { todoRepository.save(any()) } returns todo

        val result = todoService.createTodo(username, request)

        assertEquals("Estudar Kotlin", result.title)
        verify(exactly = 1) { todoRepository.save(any()) }
    }

    @Test
    fun `should throw error when toggling other users todo`() {
        val hacker = "hacker_user"
        val ownerUser = User(id = 1, username = "owner", password = "123")
        val todo = Todo(id = 1, title = "Task", user = ownerUser)

        every { todoRepository.findById(1) } returns Optional.of(todo)

        assertThrows(RuntimeException::class.java) {
            todoService.toggleTodo(1, hacker)
        }
    }
}