package com.supermarket.controller;

import com.supermarket.service.RelatoriosService;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.JRException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/relatorios")
public class RelatoriosController {

    @Autowired
    private RelatoriosService relatoriosService;

    @GetMapping()
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<byte[]> gerarRelatorio() throws JRException, FileNotFoundException {
        return relatoriosService.exportarRelatorio();
    }
}
