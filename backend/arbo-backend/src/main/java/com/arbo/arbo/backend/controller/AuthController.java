package com.arbo.arbo.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arbo.arbo.backend.dto.LoginRequestDTO;
import com.arbo.arbo.backend.dto.UsuarioResponseDTO;
import com.arbo.arbo.backend.model.Usuario;
import com.arbo.arbo.backend.service.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        Usuario usuario = usuarioService.autenticar(dto.email(), dto.senha());

        return ResponseEntity.ok(new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTipo()));
    }
}