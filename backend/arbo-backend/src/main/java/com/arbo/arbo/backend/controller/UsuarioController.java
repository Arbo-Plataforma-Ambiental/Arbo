package com.arbo.arbo.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arbo.arbo.backend.dto.UsuarioRequestDTO;
import com.arbo.arbo.backend.dto.UsuarioResponseDTO;
import com.arbo.arbo.backend.model.Usuario;
import com.arbo.arbo.backend.service.UsuarioService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }


    @GetMapping
    public List<UsuarioResponseDTO> listar() {
        return usuarioService.listarTodos()
                .stream()
                .map(this::converterParaDTO)
                .toList();
    } // get usuarios, com camada de segurança DTO

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> cadastrar(
            @RequestBody UsuarioRequestDTO dto) {

        Usuario usuario = converterParaEntidade(dto);
        Usuario salvo = usuarioService.cadastrar(usuario);

        return ResponseEntity.ok(converterParaDTO(salvo));
    } // create usuarios, com camada de segurança DTO

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(
            @PathVariable Long id) {

        return usuarioService.buscarPorId(id)
                .map(this::converterParaDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestBody UsuarioRequestDTO dto) {

        Usuario usuario = converterParaEntidade(dto);
        Usuario atualizado = usuarioService.atualizar(id, usuario);

        if (atualizado == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(converterParaDTO(atualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioService.buscarPorId(id);

        if (usuario.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        usuarioService.excluir(id);

        return ResponseEntity.noContent().build();

    }

    private UsuarioResponseDTO converterParaDTO(Usuario usuario) {
    return new UsuarioResponseDTO(
        usuario.getId(),
        usuario.getNome(),
        usuario.getEmail(),
        usuario.getTipo()
    );
    }

    private Usuario converterParaEntidade(UsuarioRequestDTO dto) {
        Usuario usuario = new Usuario();

        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenha(dto.senha());
        usuario.setTipo(dto.tipo());

        return usuario;
    }

}
