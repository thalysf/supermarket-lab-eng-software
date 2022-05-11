package com.supermarket.controller;

import com.supermarket.service.ProdutoService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/microterminal")
public class MicroterminalController {
    @Autowired
    private ProdutoService produtoService;

    @GetMapping("/codigo_barras/{codigoBarras}")
    @ResponseStatus(HttpStatus.OK)
    public String bucarProdutoCodigoBarras(@PathVariable String codigoBarras) {
        return produtoService.buscarProdutoMicroterminal(codigoBarras);
    }

}
