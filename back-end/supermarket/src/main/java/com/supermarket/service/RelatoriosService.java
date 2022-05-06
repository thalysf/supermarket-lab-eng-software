package com.supermarket.service;

import com.supermarket.domain.dto.*;
import com.supermarket.domain.entity.CartaoCliente;
import com.supermarket.domain.entity.ItemVenda;
import com.supermarket.domain.entity.Usuario;
import com.supermarket.domain.entity.Venda;
import com.supermarket.domain.enums.TipoEnum;
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

import javax.transaction.Transactional;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;

@Service
@Transactional
public class RelatoriosService {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public ResponseEntity<byte[]> exportarRelatorioSetor(Date dataInicio, Date dataFim) throws JRException, FileNotFoundException {

        RelatorioSetorDto relatorioSetorDto = new RelatorioSetorDto();
        relatorioSetorDto.setDataInicio(dataInicio);
        relatorioSetorDto.setDataFim(dataFim);

        Set<ItemVenda> vendas = vendaRepository.findItemVendaPorPeriodo(dataInicio, dataFim);
        Set<CartaoCliente> cartoes = vendaRepository.findCartaoVendaPorPeriodo(dataInicio, dataFim);

        Double totalMercado = 0.0;
        Double totalCafeteria = 0.0;

            for (ItemVenda iv : vendas){
                totalMercado += iv.getProduto().getPrecoVenda();
            }

            for(CartaoCliente c : cartoes){
                for(ItemVenda iv : c.getProdutosCafeteria()){
                    totalCafeteria += iv.getProduto().getPrecoVenda();
                }
            }

        relatorioSetorDto.setTotalCafeteria(totalCafeteria);
        relatorioSetorDto.setTotalMercado(totalMercado);

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
        Set<ItemVenda> vendas = vendaRepository.findItemVendaPorPeriodo(dataInicio, dataFim);
        Set<CartaoCliente> cartoes = vendaRepository.findCartaoVendaPorPeriodo(dataInicio, dataFim);

        Map<String, Double> produtosVendidos = new HashMap<>();

        vendas.forEach(venda ->{
            if(produtosVendidos.containsKey(venda.getProduto().getNome())){
                Double valorAtual = produtosVendidos.get(venda.getProduto().getNome());
                Double valorNovo = venda.getQuantidade() * venda.getProduto().getPrecoVenda();
                produtosVendidos.put(venda.getProduto().getNome(), valorNovo + valorAtual);
            }
            else{
                Double valorNovo = venda.getQuantidade() * venda.getProduto().getPrecoVenda();
                produtosVendidos.put(venda.getProduto().getNome(), valorNovo);
            }

        });

        cartoes.forEach(cartaoCliente -> {
            cartaoCliente.getProdutosCafeteria().forEach(venda ->{
                if(produtosVendidos.containsKey(venda.getProduto().getNome())){
                    Double valorAtual = produtosVendidos.get(venda.getProduto().getNome());
                    Double valorNovo = venda.getQuantidade() * venda.getProduto().getPrecoVenda();
                    produtosVendidos.put(venda.getProduto().getNome(), valorNovo + valorAtual);
                }
                else{
                    Double valorNovo = venda.getQuantidade() * venda.getProduto().getPrecoVenda();
                    produtosVendidos.put(venda.getProduto().getNome(), valorNovo);
                }
            });
        });

        RelatorioProdutoDto relatorioProdutoDto = new RelatorioProdutoDto();
        relatorioProdutoDto.setInicio(dataInicio);
        relatorioProdutoDto.setFim(dataFim);

        List<RelatorioItemProdutoDto> produtos = new ArrayList<>();
        produtosVendidos.forEach((prod, valorTotal) ->{
            produtos.add(new RelatorioItemProdutoDto(prod, valorTotal));
        });

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

    public ResponseEntity<byte[]> exportarRelatorioCliente(Date dataInicio, Date dataFim) throws JRException, FileNotFoundException {
        Set<Venda> vendas = vendaRepository.findVendaPorPeriodo(dataInicio, dataFim);

        Map<String, Double> vendasClientes = new HashMap<>();

        vendas.forEach(venda ->{
            String nomeCliente = venda.getNome();
            Long idVenda = venda.getId_venda();
            Set<ItemVenda> itens_venda = vendaRepository.findItemVendaPorIdVenda(idVenda);
            Set<CartaoCliente> cartoes = vendaRepository.findCartaoClientePorIdVenda(idVenda);

            vendasClientes.put(nomeCliente, 0D);
            itens_venda.forEach(i -> vendasClientes.put(nomeCliente,  vendasClientes.get(nomeCliente) + (i.getQuantidade() * i.getProduto().getPrecoVenda())));
            cartoes.forEach(c -> {
                c.getProdutosCafeteria().forEach(i -> vendasClientes.put(nomeCliente,  vendasClientes.get(nomeCliente) + (i.getQuantidade() * i.getProduto().getPrecoVenda())));
            });
        });

        RelatorioClienteDto relatorioProdutoDto = new RelatorioClienteDto();
        relatorioProdutoDto.setInicio(dataInicio);
        relatorioProdutoDto.setFim(dataFim);

        List<RelatorioItemClienteDto> clientes = new ArrayList<>();
        vendasClientes.forEach((prod, valorTotal) ->{
            clientes.add(new RelatorioItemClienteDto(prod, valorTotal));
        });

        relatorioProdutoDto.setClientes(clientes);

        File file = ResourceUtils.getFile("src/main/resources/clientes.jrxml");
        JasperReport jasperReport = JasperCompileManager.compileReport(file.getAbsolutePath());
        List<RelatorioClienteDto> data = new ArrayList<>();
        data.add(relatorioProdutoDto);

        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(data);
        Map<String, Object> parameters = new HashMap<>();
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);

        byte[] dataBytes = JasperExportManager.exportReportToPdf(jasperPrint);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set(HttpHeaders.CONTENT_DISPOSITION, "inline;filename=relatorio.pdf");
        return ResponseEntity.ok().headers(httpHeaders).contentType(MediaType.APPLICATION_PDF).body(dataBytes);
    }

    public ResponseEntity<byte[]> exportarRelatorioTipo(Date dataInicio, Date dataFim) throws JRException, FileNotFoundException {

        Set<ItemVenda> vendas      = vendaRepository.findItemVendaPorPeriodo(dataInicio, dataFim);
        Set<CartaoCliente> cartoes = vendaRepository.findCartaoVendaPorPeriodo(dataInicio, dataFim);

        RelatorioTipoDto relatorioTipoDto = new RelatorioTipoDto();

        List<TipoInformacoesDto> lista = new ArrayList<>();

        for (CartaoCliente c : cartoes){
            vendas.addAll(c.getProdutosCafeteria());
        }

        for(TipoEnum tipo : TipoEnum.values()){
            TipoInformacoesDto tipoInformacoesDto = new TipoInformacoesDto();
            tipoInformacoesDto.setNome(tipo.getDescricao());
            tipoInformacoesDto.setTotal(0.0);
            lista.add(tipoInformacoesDto);
        }

        for (ItemVenda iv : vendas){
            for(TipoInformacoesDto tipo: lista){
                if(tipo.getNome().equals(iv.getProduto().getTipo().getDescricao())){
                    tipo.setTotal(tipo.getTotal() + iv.getProduto().getPrecoVenda());
                }
            }
        }

        relatorioTipoDto.setData(lista);

        File file = ResourceUtils.getFile("classpath:relatorioTipoProduto.jrxml");
        JasperReport jasperReport = JasperCompileManager.compileReport(file.getAbsolutePath());
        List<RelatorioTipoDto> data = new ArrayList<>();
        data.add(relatorioTipoDto);

        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(data);
        Map<String, Object> parameters = new HashMap<>();
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);
        byte[] dataBytes = JasperExportManager.exportReportToPdf(jasperPrint);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set(HttpHeaders.CONTENT_DISPOSITION, "inline;filename=relatorio.pdf");
        return ResponseEntity.ok().headers(httpHeaders).contentType(MediaType.APPLICATION_PDF).body(dataBytes);
    }
}
