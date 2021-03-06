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

    @GetMapping("/setor/{dataInicio}/{dataFim}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<byte[]> gerarRelatorioPorSetor(@PathVariable(value="dataInicio") String dataInicio,
                                                         @PathVariable(value="dataFim") String dataFim) throws JRException, FileNotFoundException, ParseException {
        Date dtInicio = new SimpleDateFormat("yyyy-MM-dd").parse(dataInicio);
        Date dtFim = new SimpleDateFormat("yyyy-MM-dd").parse(dataFim);
        return relatoriosService.exportarRelatorioSetor(dtInicio, dtFim);
    }


    @GetMapping("/produto/{dataInicio}/{dataFim}")
    public ResponseEntity<byte[]> gerarRelatorioPorProduto(@PathVariable(value="dataInicio") String dataInicio,
                                                         @PathVariable(value="dataFim") String dataFim) throws JRException, FileNotFoundException, ParseException {
        Date dtInicio = new SimpleDateFormat("yyyy-MM-dd").parse(dataInicio);
        Date dtFim = new SimpleDateFormat("yyyy-MM-dd").parse(dataFim);
        return relatoriosService.exportarRelatorioProduto(dtInicio, dtFim);
    }


    @GetMapping("/cliente/{dataInicio}/{dataFim}")
    public ResponseEntity<byte[]> gerarRelatorioPorCliente(@PathVariable(value="dataInicio") String dataInicio,
                                                           @PathVariable(value="dataFim") String dataFim) throws JRException, FileNotFoundException, ParseException {
        Date dtInicio = new SimpleDateFormat("yyyy-MM-dd").parse(dataInicio);
        Date dtFim = new SimpleDateFormat("yyyy-MM-dd").parse(dataFim);
        return relatoriosService.exportarRelatorioCliente(dtInicio, dtFim);
    }

    @GetMapping("/tipo/{dataInicio}/{dataFim}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<byte[]> gerarRelatorioPorTipo(@PathVariable(value="dataInicio") String dataInicio,
                                                        @PathVariable(value="dataFim") String dataFim) throws FileNotFoundException, JRException, ParseException {
        Date dtInicio = new SimpleDateFormat("yyyy-MM-dd").parse(dataInicio);
        Date dtFim = new SimpleDateFormat("yyyy-MM-dd").parse(dataFim);
        return relatoriosService.exportarRelatorioTipo(dtInicio, dtFim);
    }
}
