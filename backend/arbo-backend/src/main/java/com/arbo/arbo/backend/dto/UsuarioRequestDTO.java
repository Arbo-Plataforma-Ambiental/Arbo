package com.arbo.arbo.backend.dto;

public record UsuarioRequestDTO(
    String nome,
    String email,
    String senha,
    String tipo
) {}