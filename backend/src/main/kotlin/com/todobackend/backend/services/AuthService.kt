package com.todobackend.backend.services

import com.todobackend.backend.models.AuthRequest
import com.todobackend.backend.models.AuthResponse
import com.todobackend.backend.models.User
import com.todobackend.backend.repositories.UserRepository
import com.todobackend.backend.security.JwtService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService
) {
    fun register(request: AuthRequest): AuthResponse {
        if (userRepository.findByUsername(request.username) != null) {
            throw RuntimeException("Username already exists")
        }
        val user = User(
            username = request.username,
            password = passwordEncoder.encode(request.password)
        )
        userRepository.save(user)
        val jwtToken = jwtService.generateToken(user.username)
        return AuthResponse(jwtToken)
    }

    fun login(request: AuthRequest): AuthResponse {
        val user = userRepository.findByUsername(request.username)
            ?: throw RuntimeException("Invalid credentials")

        if (!passwordEncoder.matches(request.password, user.password)) {
            throw RuntimeException("Invalid credentials")
        }
        val jwtToken = jwtService.generateToken(user.username)
        return AuthResponse(jwtToken)
    }
}