package com.supermarket.controller;

import com.supermarket.domain.dto.TelaDto;
import com.supermarket.service.TelaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/telas")
@Validated
public class TelaController {

    private final TelaService telaService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Set<TelaDto> listarTelas() {
        return telaService.listarTelas();
    }


}
