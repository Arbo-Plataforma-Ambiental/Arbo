package com.arbo.arbo.backend.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record OcorrenciaRequestDTO(
    @NotBlank(message = "O título é obrigatório")
    @Size(max = 100, message = "O título deve ter no máximo 100 caracteres")
    String titulo,

    @NotBlank(message = "A descrição é obrigatória")
    @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres")
    String descricao,

    @NotBlank(message = "O tipo é obrigatório")
    @Size(max = 50, message = "O tipo deve ter no máximo 50 caracteres")
    String tipo,

    @NotNull(message = "A latitude é obrigatória")
    @DecimalMin(value = "-90.0", message = "Latitude inválida")
    @DecimalMax(value = "90.0", message = "Latitude inválida")
    BigDecimal latitude,

    @NotNull(message = "A longitude é obrigatória")
    @DecimalMin(value = "-180.0", message = "Longitude inválida")
    @DecimalMax(value = "180.0", message = "Longitude inválida")
    BigDecimal longitude,

    @Size(max = 500, message = "A imagem deve ter no máximo 500 caracteres")
    String imagem,

    @Pattern(regexp = "PENDENTE|APROVADA|RECUSADA|RESOLVIDA",
             message = "Status deve ser PENDENTE, APROVADA, RECUSADA ou RESOLVIDA")
    String status,

    @NotNull(message = "O usuário é obrigatório")
    Long usuarioId
) {}