package com.supermarket.repository;

import com.supermarket.domain.entity.CartaoCliente;
import com.supermarket.domain.entity.ItemVenda;
import com.supermarket.domain.entity.Venda;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Repository
@Transactional
public interface VendaRepository extends CrudRepository<Venda, Long> {
    @Override
    Set<Venda> findAll();

    @Query("select v.produtosSupermercado from Venda v where v.data BETWEEN ?1 AND ?2")
    Set<ItemVenda> findItemVendaPorPeriodo(Date dataInicio, Date fim);

    @Query("select v.cartoes from Venda v where v.data BETWEEN ?1 AND ?2")
    Set<CartaoCliente> findCartaoVendaPorPeriodo(Date dataInicio, Date fim);
}
