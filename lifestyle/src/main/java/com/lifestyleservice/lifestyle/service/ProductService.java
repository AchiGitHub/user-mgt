package com.lifestyleservice.lifestyle.service;

import com.lifestyleservice.lifestyle.entity.Product;
import com.lifestyleservice.lifestyle.util.TransportDto;
import org.springframework.stereotype.Service;

import java.util.UUID;

public interface ProductService {
    TransportDto addProduct(Product product);
    TransportDto editProduct(UUID id, Product product);
    boolean deleteProduct(UUID id);
    TransportDto sellItem(UUID id, Integer qty);
    TransportDto getAllProducts();
    TransportDto getProduct(UUID id);
}
