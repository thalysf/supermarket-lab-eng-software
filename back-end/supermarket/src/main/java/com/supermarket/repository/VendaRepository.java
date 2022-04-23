package com.supermarket.repository;

import com.supermarket.domain.entity.Venda;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Set;

@Repository
@Transactional
public interface VendaRepository extends CrudRepository<Venda, Long> {
    @Override
    Set<Venda> findAll();
}
