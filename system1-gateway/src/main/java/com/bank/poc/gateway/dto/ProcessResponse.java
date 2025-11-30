package com.bank.poc.gateway.dto;

import lombok.Data;

@Data
public class ProcessResponse {
    private boolean success;
    private String message;
    private Double balance;
    private Long transactionId;
}
