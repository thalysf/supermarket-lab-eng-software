package com.supermarket.repository;

import com.supermarket.domain.entity.Usuario;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsuarioRepository extends CrudRepository<Usuario, String> {
    @Override
    List<Usuario> findAll();
}
