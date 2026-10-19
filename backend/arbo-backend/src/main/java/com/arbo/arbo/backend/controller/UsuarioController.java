package com.arbo.arbo.backend.controller;


import java.util.List;
import com.arbo.arbo.backend.model.Usuario;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arbo.arbo.backend.service.UsuarioService;

@RestController 
@RequestMapping ("/usuarios")
public class UsuarioController {
    
    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping 
    public List<Usuario> listar() {
        return usuarioService.listarTodos();
    }

}
