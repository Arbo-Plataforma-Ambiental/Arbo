package com.arbo.arbo.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OcorrenciaResponseDTO(
    Long id,
    String titulo,
    String descricao,
    String tipo,
    BigDecimal latitude,
    BigDecimal longitude,
    String imagem,
    String status,
    LocalDateTime dataRegistro,
    Long usuarioId
) {}