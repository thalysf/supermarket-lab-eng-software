package com.supermarket.controller;

import com.supermarket.service.RelatoriosService;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.JRException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

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

    @GetMapping("/setor/{dataInicio}/{dataFim}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<byte[]> gerarRelatorioPorSetor(@PathVariable(value="dataInicio") String dataInicio,
                                                         @PathVariable(value="dataFim") String dataFim) throws JRException, FileNotFoundException, ParseException {
        Date dtInicio = new SimpleDateFormat("yyyy-MM-dd").parse(dataInicio);
        Date dtFim = new SimpleDateFormat("yyyy-MM-dd").parse(dataFim);
        return relatoriosService.exportarRelatorioSetor(dtInicio, dtFim);
    }
}
