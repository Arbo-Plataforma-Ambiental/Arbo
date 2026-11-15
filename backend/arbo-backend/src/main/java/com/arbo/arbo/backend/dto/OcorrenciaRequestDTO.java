package com.arbo.arbo.backend.dto;

import java.math.BigDecimal;

public record OcorrenciaRequestDTO(
    String titulo,
    String descricao,
    String tipo,
    BigDecimal latitude,
    BigDecimal longitude,
    String imagem,
    String status,
    Long usuarioId
) {}