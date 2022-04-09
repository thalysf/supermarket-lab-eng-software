package com.supermarket.domain.mapper;

import com.supermarket.domain.dto.CartaoClienteDto;
import com.supermarket.domain.entity.CartaoCliente;
import org.mapstruct.Mapper;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface CafeteriaMapper {
    CartaoCliente cartaoClienteDtoToCartaoCliente(CartaoClienteDto cartaoClienteDto);

    CartaoClienteDto cartaoClienteDtoToCartaoCliente(CartaoCliente cartaoCliente);

    Set<CartaoClienteDto> setCartaoClienteToSetCartaoClienteDto(Set<CartaoCliente> cartaoClientes);
}
