package com.lifestyleservice.lifestyle.service;

import com.lifestyleservice.lifestyle.util.TransportDto;

public interface ReportingService {
    TransportDto getReport(String startDate, String endDate);
}
