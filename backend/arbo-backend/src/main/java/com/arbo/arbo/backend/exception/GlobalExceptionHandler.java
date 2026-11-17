package com.arbo.arbo.backend.exception;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 400 - falha nas validações do DTO (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> tratarValidacao(MethodArgumentNotValidException ex) {
        Map<String, String> campos = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(e -> campos.putIfAbsent(e.getField(), e.getDefaultMessage()));

        Map<String, Object> corpo = new LinkedHashMap<>();
        corpo.put("erro", "Dados inválidos");
        corpo.put("campos", campos);

        return ResponseEntity.badRequest().body(corpo);
    }

    // 400 JSON malformado
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> tratarJsonInvalido(HttpMessageNotReadableException ex) {
        return ResponseEntity.badRequest().body(Map.of("erro", "Corpo da requisição inválido"));
    }

    // erros lançados nos services/controllers (401  409 400...)
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> tratarStatus(ResponseStatusException ex) {
        String mensagem = ex.getReason() != null ? ex.getReason() : "Erro na requisição";
        return ResponseEntity.status(ex.getStatusCode()).body(Map.of("erro", mensagem));
    }

    // 409 violação de integridade no banco (ex: email duplicado no PUT)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> tratarIntegridade(DataIntegrityViolationException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("erro", "Registro duplicado ou violação de integridade"));
    }
}