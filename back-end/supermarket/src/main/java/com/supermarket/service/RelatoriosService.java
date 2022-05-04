package com.supermarket.service;

import com.supermarket.domain.dto.RelatorioSetorDto;
import com.supermarket.domain.entity.ItemVenda;
import com.supermarket.domain.entity.Usuario;
import com.supermarket.domain.entity.Venda;
import com.supermarket.repository.UsuarioRepository;
import com.supermarket.repository.VendaRepository;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;

@Service
public class RelatoriosService {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public ResponseEntity<byte[]> exportarRelatorio() throws JRException, FileNotFoundException {

        String teste = "aaaaaaaaaaa";

        Usuario usuario = usuarioRepository.findByCpf("75538833011");

        File file = ResourceUtils.getFile("classpath:relatorio_teste.jrxml");
        JasperReport jasperReport = JasperCompileManager.compileReport(file.getAbsolutePath());
        List<Usuario> data = new ArrayList<>();
        data.add(usuario);
        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(data);
        Map<String, Object> parameters = new HashMap<>();
       // parameters.put("testevar", "Alexandre");
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);
        byte[] dataBytes = JasperExportManager.exportReportToPdf(jasperPrint);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set(HttpHeaders.CONTENT_DISPOSITION, "inline;filename=relatorio.pdf");
        return ResponseEntity.ok().headers(httpHeaders).contentType(MediaType.APPLICATION_PDF).body(dataBytes);
    }

    public ResponseEntity<byte[]> exportarRelatorioSetor(Date dataInicio, Date dataFim) throws JRException, FileNotFoundException {

        RelatorioSetorDto relatorioSetorDto = new RelatorioSetorDto();
        relatorioSetorDto.setDataInicio(dataInicio);
        relatorioSetorDto.setDataFim(dataFim);

        Set<Venda> vendas = vendaRepository.findVendaPorPeriodo(dataInicio, dataFim);

        Double totalMercado = 0.0;
        Double totalCafeteria = 0.0;

        for (Venda v : vendas){
            for (ItemVenda iv : v.getProdutosSupermercado()){
                totalMercado += iv.getProduto().getPrecoVenda();
            }
        }

        relatorioSetorDto.setTotalCafeteria(totalMercado);
        relatorioSetorDto.setTotalMercado(28.5);

        File file = ResourceUtils.getFile("classpath:relatorioSetor.jrxml");
        JasperReport jasperReport = JasperCompileManager.compileReport(file.getAbsolutePath());
        List<RelatorioSetorDto> data = new ArrayList<>();
        data.add(relatorioSetorDto);
        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(data);
        Map<String, Object> parameters = new HashMap<>();
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);
        byte[] dataBytes = JasperExportManager.exportReportToPdf(jasperPrint);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set(HttpHeaders.CONTENT_DISPOSITION, "inline;filename=relatorio.pdf");
        return ResponseEntity.ok().headers(httpHeaders).contentType(MediaType.APPLICATION_PDF).body(dataBytes);
    }
}
