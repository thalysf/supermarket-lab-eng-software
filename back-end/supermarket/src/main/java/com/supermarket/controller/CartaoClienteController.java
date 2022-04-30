package com.supermarket.controller;


import com.supermarket.domain.dto.CartaoClienteDto;
import com.supermarket.service.CartaoClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/cartaocliente")
public class CartaoClienteController {
    private final CartaoClienteService cartaoClienteService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void cadastrarCartaoCliente(@RequestBody CartaoClienteDto cartaoClienteDto) {
        cartaoClienteService.cadastrarCartaoCliente(cartaoClienteDto);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void incluirProdutosCafeteriaNoCartao(@RequestBody CartaoClienteDto cartaoClienteDto) {
        cartaoClienteService.atualizarCartao(cartaoClienteDto);
    }

    @DeleteMapping("/{rfid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarCartaoCliente(@PathVariable String rfid) {
        cartaoClienteService.deletarCartaoCliente(rfid);
    }


    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Set<CartaoClienteDto> listarCartaoClientes() {
        return cartaoClienteService.listarCartaoClientes();
    }
}
