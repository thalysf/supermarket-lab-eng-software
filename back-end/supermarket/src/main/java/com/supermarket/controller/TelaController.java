package com.supermarket.controller;

import com.supermarket.domain.dto.TelaDto;
import com.supermarket.service.TelaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@Validated
@CrossOrigin
@RequestMapping("/telas")
public class TelaController {
    @Autowired
    private TelaService telaService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Set<TelaDto> listarTelas() {
        return telaService.listarTelas();
    }


}
