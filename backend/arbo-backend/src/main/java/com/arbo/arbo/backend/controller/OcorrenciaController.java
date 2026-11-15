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

import com.arbo.arbo.backend.dto.OcorrenciaRequestDTO;
import com.arbo.arbo.backend.dto.OcorrenciaResponseDTO;
import com.arbo.arbo.backend.model.Ocorrencia;
import com.arbo.arbo.backend.model.Usuario;
import com.arbo.arbo.backend.service.OcorrenciaService;
import com.arbo.arbo.backend.service.UsuarioService;

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
            @RequestBody OcorrenciaRequestDTO dto) {

        Optional<Usuario> usuario = usuarioService.buscarPorId(dto.usuarioId());

        if (usuario.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Ocorrencia ocorrencia = converterParaEntidade(dto, usuario.get());
        Ocorrencia salva = ocorrenciaService.cadastrar(ocorrencia);

        return ResponseEntity.ok(converterParaDTO(salva));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OcorrenciaResponseDTO> buscarPorId(
            @PathVariable Long id) {

        return ocorrenciaService.buscarPorId(id)
                .map(this::converterParaDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<OcorrenciaResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestBody OcorrenciaRequestDTO dto) {

        Optional<Ocorrencia> existente = ocorrenciaService.buscarPorId(id);

        if (existente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Ocorrencia dadosAtualizados = new Ocorrencia();

        dadosAtualizados.setTitulo(dto.titulo());
        dadosAtualizados.setDescricao(dto.descricao());
        dadosAtualizados.setTipo(dto.tipo());
        dadosAtualizados.setLatitude(dto.latitude());
        dadosAtualizados.setLongitude(dto.longitude());
        dadosAtualizados.setStatus(dto.status());

        Ocorrencia atualizada =
                ocorrenciaService.atualizar(id, dadosAtualizados);

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

    private OcorrenciaResponseDTO converterParaDTO(Ocorrencia ocorrencia) {
    return new OcorrenciaResponseDTO(
        ocorrencia.getId(),
        ocorrencia.getTitulo(),
        ocorrencia.getDescricao(),
        ocorrencia.getTipo(),
        ocorrencia.getLatitude(),
        ocorrencia.getLongitude(),
        ocorrencia.getImagem(),
        ocorrencia.getStatus(),
        ocorrencia.getDataRegistro(),
        ocorrencia.getUsuario().getId()
    );
}

    private Ocorrencia converterParaEntidade(
            OcorrenciaRequestDTO dto,
            Usuario usuario) {

        Ocorrencia ocorrencia = new Ocorrencia();

        ocorrencia.setTitulo(dto.titulo());
        ocorrencia.setDescricao(dto.descricao());
        ocorrencia.setTipo(dto.tipo());
        ocorrencia.setLatitude(dto.latitude());
        ocorrencia.setLongitude(dto.longitude());
        ocorrencia.setImagem(dto.imagem());
        ocorrencia.setUsuario(usuario);

        return ocorrencia;
    }

}
