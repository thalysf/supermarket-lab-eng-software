package com.supermarket.controller;

import com.supermarket.domain.dto.VendaDto;
import com.supermarket.exception.RegraNegocioException;
import com.supermarket.service.VendaService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/vendas")
public class VendaController {

    private final VendaService vendaService;

    @PostMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void realizarVenda(@RequestBody VendaDto vendaDto) {
        try{
            vendaService.realizarVenda(vendaDto);
        }
        catch (DataIntegrityViolationException e){
            throw new RegraNegocioException("Cartao já associado a uma venda.");
        }
    }
}
