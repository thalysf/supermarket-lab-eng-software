package com.supermarket.controller;


import com.supermarket.domain.dto.EstoqueDTO;
import com.supermarket.domain.dto.ProdutoDto;
import com.supermarket.service.ProdutoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/estoques")
@Validated
public class EstoqueController {

    private final ProdutoService produtoService;

    @GetMapping("/codigo_barras/{codigoBarras}")
    @ResponseStatus(HttpStatus.OK)
    public ProdutoDto bucarProdutoCodigoBarras(@PathVariable String codigoBarras) {
        return produtoService.buscarProdutoCodigoBarras(codigoBarras);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public void atualizarEstoque(@RequestBody EstoqueDTO estoqueDTO) {
        produtoService.atualizarEstoque(estoqueDTO);
    }
}
