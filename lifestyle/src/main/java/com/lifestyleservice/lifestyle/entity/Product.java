package com.lifestyleservice.lifestyle.entity;

import com.lifestyleservice.lifestyle.enums.ProductType;
import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.UUID;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Table(name = "store")
public class Product extends Auditable<String> {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    @NotNull
    private String productName;
    @NotNull
    private Integer quantity;
    @NotNull
    private Double price;
    @NotNull
    private Double sellingPrice;
    @NotNull
    private ProductType productType;
    @NotNull
    private Integer sold;
}
