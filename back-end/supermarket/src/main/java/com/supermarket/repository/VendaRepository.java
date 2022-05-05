package com.supermarket.repository;

import com.supermarket.domain.entity.ItemVenda;
import com.supermarket.domain.entity.Venda;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.Set;

@Repository
@Transactional
public interface VendaRepository extends CrudRepository<Venda, Long> {
    @Override
    Set<Venda> findAll();

    @Query("select v from Venda v where v.data BETWEEN ?1 AND ?2")
    Set<Venda> findVendaPorPeriodo(Date dataInicio, Date fim);
}
