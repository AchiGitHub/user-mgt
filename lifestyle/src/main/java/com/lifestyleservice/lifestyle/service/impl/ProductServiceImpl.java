package com.lifestyleservice.lifestyle.service.impl;

import com.lifestyleservice.lifestyle.entity.Payments;
import com.lifestyleservice.lifestyle.entity.Product;
import com.lifestyleservice.lifestyle.enums.PaymentTypes;
import com.lifestyleservice.lifestyle.repository.PaymentsRepository;
import com.lifestyleservice.lifestyle.repository.ProductRepository;
import com.lifestyleservice.lifestyle.service.ProductService;
import com.lifestyleservice.lifestyle.util.RequestHelper;
import com.lifestyleservice.lifestyle.util.TransportDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final RequestHelper requestHelper;
    private final PaymentsRepository paymentsRepository;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository, RequestHelper requestHelper, PaymentsRepository paymentsRepository) {
        this.productRepository = productRepository;
        this.requestHelper = requestHelper;
        this.paymentsRepository = paymentsRepository;
    }

    @Override
    public TransportDto addProduct(Product product) {
        try {
            Object savedProduct = productRepository.save(product);
            return requestHelper.setResponse(savedProduct);
        } catch (Error error) {
            return requestHelper.setError(HttpStatus.BAD_REQUEST, "Something went wrong!");
        }
    }

    @Override
    public TransportDto getAllProducts() {
        List<Product> products = productRepository.findAll();
        return requestHelper.setResponse(products);
    }

    @Override
    public TransportDto getProduct(UUID id) {
        return requestHelper.setResponse(productRepository.findById(id));
    }

    @Override
    public TransportDto editProduct(UUID id, Product product) {
        try {
            Product savedProduct = productRepository.findById(id).get();
            if (Objects.nonNull(product.getProductName())) {
                savedProduct.setProductName(product.getProductName());
            }
            if (Objects.nonNull(product.getQuantity())) {
                savedProduct.setQuantity(product.getQuantity());
            }
            if (Objects.nonNull(product.getSellingPrice())) {
                savedProduct.setSellingPrice(product.getSellingPrice());
            }
            if (Objects.nonNull(product.getPrice())) {
                savedProduct.setPrice(product.getPrice());
            }
            if (Objects.nonNull(product.getSold())) {
                savedProduct.setSold(product.getSold());
            }
            savedProduct.setLastModifiedDate(LocalDateTime.now());
            productRepository.save(savedProduct);
            return requestHelper.setResponse(savedProduct);
        } catch (Error error) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found!", error);
        }
    }

    @Override
    public boolean deleteProduct(UUID id) {
        try {
            productRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    @Override
    public TransportDto sellItem(UUID id, Integer qty) {
        try {
            Product savedProduct = productRepository.findById(id).get();
            savedProduct.setSold(savedProduct.getSold() + qty);
            productRepository.save(savedProduct);

            // Create payment record
            Payments payment = new Payments();
            payment.setAmount(savedProduct.getPrice());
            payment.setCategory(savedProduct.getProductType().toString());
            payment.setRegistrationId(UUID.fromString("00000000-0000-0000-0000-000000000000"));
            payment.setPaymentType(PaymentTypes.CASH);
            payment.setCreatedBy("SYSTEM");
            payment.setCreatedDate(LocalDateTime.now());
            payment.setLastModifiedDate(LocalDateTime.now());
            payment.setLastModifiedBy("SYSTEM");

            paymentsRepository.save(payment);

            return requestHelper.setResponse(savedProduct);
        } catch (Error error) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found!", error);
        }
    }
}
