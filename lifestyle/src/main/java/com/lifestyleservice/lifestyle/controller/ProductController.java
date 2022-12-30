package com.lifestyleservice.lifestyle.controller;

import com.lifestyleservice.lifestyle.dto.SellProductDto;
import com.lifestyleservice.lifestyle.entity.Product;
import com.lifestyleservice.lifestyle.service.ProductService;
import com.lifestyleservice.lifestyle.util.TransportDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/v1/product")
public class ProductController {
    private ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("")
    public ResponseEntity addProduct(@RequestBody Product product) {
        product.setLastModifiedBy("SYSTEM");
        product.setCreatedBy("SYSTEM");
        product.setCreatedDate(LocalDateTime.now());
        product.setLastModifiedDate(LocalDateTime.now());
        TransportDto res = productService.addProduct(product);
        return ResponseEntity.ok(res.getResponse());
    }

    @GetMapping("")
    public ResponseEntity getAllProducts() {
        TransportDto res = productService.getAllProducts();
        return ResponseEntity.ok(res.getResponse());
    }

    @PutMapping("/{id}")
    public ResponseEntity editProduct(@PathVariable UUID id, @RequestBody Product product) {
        TransportDto res = productService.editProduct(id, product);
        return ResponseEntity.ok(res.getResponse());
    }

    @PostMapping("/sell")
    public ResponseEntity sellProduct(@RequestBody SellProductDto productDto) {
        TransportDto res = productService.sellItem(productDto.getId(), productDto.getQuantity());
        return ResponseEntity.ok(res.getResponse());
    }

    @GetMapping("/{id}")
    public ResponseEntity getProduct(@PathVariable UUID id) {
        TransportDto res = productService.getProduct(id);
        return ResponseEntity.ok(res.getResponse());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteProduct(@PathVariable UUID id) {
        boolean res = productService.deleteProduct(id);
        return ResponseEntity.ok(res);
    }

}
