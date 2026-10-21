package com.arbo.arbo.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arbo.arbo.backend.model.Ocorrencia;
import com.arbo.arbo.backend.service.OcorrenciaService;

@RestController
@RequestMapping("/ocorrencias")
public class OcorrenciaController {

    private final OcorrenciaService ocorrenciaService;

    public OcorrenciaController(OcorrenciaService ocorrenciaService) {
        this.ocorrenciaService = ocorrenciaService;
    }

    @GetMapping
    public List<Ocorrencia> listar() {
        return ocorrenciaService.listarTodas();
    }

    @PostMapping
    public Ocorrencia cadastrar(@RequestBody Ocorrencia ocorrencia) {
        return ocorrenciaService.cadastrar(ocorrencia);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ocorrencia> buscarPorId(@PathVariable Long id) {
        Optional<Ocorrencia> ocorrencia = ocorrenciaService.buscarPorId(id);

        if (ocorrencia.isPresent()) {
            return ResponseEntity.ok(ocorrencia.get());
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ocorrencia> atualizar(
            @PathVariable Long id,
            @RequestBody Ocorrencia ocorrenciaAtualizada) {

        Ocorrencia ocorrencia = ocorrenciaService.atualizar(id, ocorrenciaAtualizada);

        if (ocorrencia == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(ocorrencia);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        Optional<Ocorrencia> ocorrencia = ocorrenciaService.buscarPorId(id);

        if (ocorrencia.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ocorrenciaService.excluir(id);

        return ResponseEntity.noContent().build();
    }

}
