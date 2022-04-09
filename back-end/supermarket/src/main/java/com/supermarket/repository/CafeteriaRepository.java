package com.supermarket.repository;

import com.supermarket.domain.entity.CartaoCliente;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Set;

@Repository
@Transactional
public interface CafeteriaRepository extends CrudRepository<CartaoCliente, String> {
    @Override
    Set<CartaoCliente> findAll();
}
