package com.arbo.arbo.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.arbo.arbo.backend.dto.OcorrenciaRequestDTO;
import com.arbo.arbo.backend.dto.OcorrenciaResponseDTO;
import com.arbo.arbo.backend.model.Ocorrencia;
import com.arbo.arbo.backend.model.Usuario;
import com.arbo.arbo.backend.service.OcorrenciaService;
import com.arbo.arbo.backend.service.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/ocorrencias")
public class OcorrenciaController {

    private final OcorrenciaService ocorrenciaService;
    private final UsuarioService usuarioService;

    public OcorrenciaController(
            OcorrenciaService ocorrenciaService,
            UsuarioService usuarioService) {

        this.ocorrenciaService = ocorrenciaService;
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<OcorrenciaResponseDTO> listar() {
        return ocorrenciaService.listarTodas()
                .stream()
                .map(this::converterParaDTO)
                .toList();
    }

    @PostMapping
    public ResponseEntity<OcorrenciaResponseDTO> cadastrar(
            @Valid @RequestBody OcorrenciaRequestDTO dto) {

        Usuario usuario = usuarioService.buscarPorId(dto.usuarioId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Usuário informado não existe"));

        Ocorrencia salva = ocorrenciaService.cadastrar(converterParaEntidade(dto, usuario));

        return ResponseEntity.status(HttpStatus.CREATED).body(converterParaDTO(salva));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OcorrenciaResponseDTO> buscarPorId(@PathVariable Long id) {
        return ocorrenciaService.buscarPorId(id)
                .map(this::converterParaDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<OcorrenciaResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody OcorrenciaRequestDTO dto) {

        Ocorrencia dados = new Ocorrencia();

        dados.setTitulo(dto.titulo());
        dados.setDescricao(dto.descricao());
        dados.setTipo(dto.tipo());
        dados.setLatitude(dto.latitude());
        dados.setLongitude(dto.longitude());
        dados.setImagem(dto.imagem());
        dados.setStatus(dto.status());

        Ocorrencia atualizada = ocorrenciaService.atualizar(id, dados);

        if (atualizada == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(converterParaDTO(atualizada));
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

    private OcorrenciaResponseDTO converterParaDTO(Ocorrencia o) {
        return new OcorrenciaResponseDTO(
                o.getId(),
                o.getTitulo(),
                o.getDescricao(),
                o.getTipo(),
                o.getLatitude(),
                o.getLongitude(),
                o.getImagem(),
                o.getStatus(),
                o.getDataRegistro(),
                o.getUsuario().getId());
    }

    private Ocorrencia converterParaEntidade(OcorrenciaRequestDTO dto, Usuario usuario) {
        Ocorrencia o = new Ocorrencia();

        o.setTitulo(dto.titulo());
        o.setDescricao(dto.descricao());
        o.setTipo(dto.tipo());
        o.setLatitude(dto.latitude());
        o.setLongitude(dto.longitude());
        o.setImagem(dto.imagem());
        if (dto.status() != null) {
            o.setStatus(dto.status());
        }
        o.setUsuario(usuario);

        return o;
    }
}