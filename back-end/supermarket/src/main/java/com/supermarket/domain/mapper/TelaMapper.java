package com.supermarket.domain.mapper;

import com.supermarket.domain.dto.TelaDto;
import com.supermarket.domain.entity.Tela;
import org.mapstruct.Mapper;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface TelaMapper {
    Set<TelaDto> setTelaToSetTelaDto(Set<Tela> telas);
}
