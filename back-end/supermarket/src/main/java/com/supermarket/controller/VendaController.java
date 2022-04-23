package com.supermarket.controller;

import com.supermarket.domain.dto.ItemVendaDto;
import com.supermarket.service.VendaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/vendas")
public class VendaController {

    private final VendaService vendaService;

    @PostMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void darBaixaVendas(@RequestBody List<ItemVendaDto> itemsVendaDto){ vendaService.realizarVenda(itemsVendaDto);
    }
}
