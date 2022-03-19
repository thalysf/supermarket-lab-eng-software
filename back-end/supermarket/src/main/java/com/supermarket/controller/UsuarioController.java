package com.supermarket.controller;

import com.supermarket.domain.dto.UsuarioDto;
import com.supermarket.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@Validated
@CrossOrigin
@RequestMapping("/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void cadastraUsuario(@Valid @RequestBody UsuarioDto usuarioDto)
    {
        usuarioService.cadastrarUsuario(usuarioDto);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public UsuarioDto atualizarUsuario(@Valid @RequestBody UsuarioDto usuarioDto)
    {
        return usuarioService.atualizarUsuario(usuarioDto);
    }

    @DeleteMapping("/{cpf}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarAtor(@PathVariable String cpf)
    {
        usuarioService.deletarUsuario(cpf);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<UsuarioDto> listarUsuarios()
    {
        return usuarioService.listarUsuarios();
    }
}
