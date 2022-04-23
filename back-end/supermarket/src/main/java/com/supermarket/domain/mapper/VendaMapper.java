package com.supermarket.domain.mapper;

import com.supermarket.domain.dto.VendaDto;
import com.supermarket.domain.entity.Venda;
import org.mapstruct.Mapper;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface VendaMapper {
    Venda vendaDtoToVenda(VendaDto vendaDto);

    VendaDto vendaDtoToVenda(Venda venda);

    Set<VendaDto> setVendaToSetVendaDto(Set<Venda> vendas);
}
