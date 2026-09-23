package com.example.bloodbankmanagementsystem.mapper;

import com.example.bloodbankmanagementsystem.dto.DonorAdminDTO;
import com.example.bloodbankmanagementsystem.dto.DonorDTO;
import com.example.bloodbankmanagementsystem.entity.DonorEntity;
import org.springframework.stereotype.Component;


@Component
public class DonorMapper {
    public DonorEntity DtoToEntity(DonorDTO dto) {

        //DTO -> Entity
        DonorEntity entity = new DonorEntity();
        entity.setIsDeleted(false);
        entity.setName(dto.getName());
        entity.setAge(dto.getAge());
        entity.setCity(dto.getCity());
        entity.setBloodGroup(dto.getBloodGroup());
        entity.setContactNumber(dto.getContactNumber());
        return entity;

    }

    public DonorDTO EntityToDto(DonorEntity entity) {

        //Entity-> DTO

        DonorDTO dto = new DonorDTO();
        dto.setName(entity.getName());
        dto.setAge(entity.getAge());
        dto.setCity(entity.getCity());
        dto.setBloodGroup(entity.getBloodGroup());
        dto.setContactNumber(entity.getContactNumber());

        return dto;
    }

    public DonorAdminDTO EntityToAdminDto(DonorEntity entity) {

        DonorAdminDTO dto = new DonorAdminDTO();

        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setAge(entity.getAge());
        dto.setCity(entity.getCity());
        dto.setBloodGroup(entity.getBloodGroup());
        dto.setContactNumber(entity.getContactNumber());

        return dto;
    }
}
