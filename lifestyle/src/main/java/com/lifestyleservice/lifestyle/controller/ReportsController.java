package com.lifestyleservice.lifestyle.controller;

import com.lifestyleservice.lifestyle.service.ReportingService;
import com.lifestyleservice.lifestyle.util.TransportDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/report")
@Slf4j
public class ReportsController {
    private ReportingService reportingService;

    @Autowired
    public ReportsController (ReportingService reportingService){
        this.reportingService = reportingService;
    }

    @GetMapping("")
    public ResponseEntity<TransportDto> getReport() {
        TransportDto res = reportingService.getReport();
        return ResponseEntity.ok(res);
    }


}
