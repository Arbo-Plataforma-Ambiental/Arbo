package com.arbo.arbo.backend.dto;

public record UsuarioResponseDTO(
    Long id,
    String nome,
    String email,
    String tipo
) {}