package com.supermarket.service;

import com.supermarket.domain.dto.RelatorioItemProdutoDto;
import com.supermarket.domain.dto.RelatorioProdutoDto;
import com.supermarket.domain.dto.RelatorioSetorDto;
import com.supermarket.domain.entity.Usuario;
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
        relatorioSetorDto.setTotalCafeteria(12.0);
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

    public ResponseEntity<byte[]> exportarRelatorioProduto(Date dataInicio, Date dataFim) throws JRException, FileNotFoundException {

        RelatorioProdutoDto relatorioProdutoDto = new RelatorioProdutoDto();
        relatorioProdutoDto.setInicio(dataInicio);
        relatorioProdutoDto.setFim(dataFim);

        RelatorioItemProdutoDto relatorioItemProdutoDto1 = new RelatorioItemProdutoDto();
        relatorioItemProdutoDto1.setNome("leite");
        relatorioItemProdutoDto1.setTotal(55.0F);

        RelatorioItemProdutoDto relatorioItemProdutoDto2 = new RelatorioItemProdutoDto();
        relatorioItemProdutoDto2.setNome("cafe");
        relatorioItemProdutoDto2.setTotal(65.0F);

        RelatorioItemProdutoDto relatorioItemProdutoDto3 = new RelatorioItemProdutoDto();
        relatorioItemProdutoDto3.setNome("picanha");
        relatorioItemProdutoDto3.setTotal(105.0F);

        List<RelatorioItemProdutoDto> produtos = new ArrayList<>();
        produtos.add(relatorioItemProdutoDto1);
        produtos.add(relatorioItemProdutoDto2);
        produtos.add(relatorioItemProdutoDto3);

        relatorioProdutoDto.setProdutos(produtos);

        File file = ResourceUtils.getFile("src/main/resources/produtos.jrxml");
        JasperReport jasperReport = JasperCompileManager.compileReport(file.getAbsolutePath());
        List<RelatorioProdutoDto> data = new ArrayList<>();
        data.add(relatorioProdutoDto);
        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(data);
        Map<String, Object> parameters = new HashMap<>();
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);
        byte[] dataBytes = JasperExportManager.exportReportToPdf(jasperPrint);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set(HttpHeaders.CONTENT_DISPOSITION, "inline;filename=relatorio.pdf");
        return ResponseEntity.ok().headers(httpHeaders).contentType(MediaType.APPLICATION_PDF).body(dataBytes);
    }
}
