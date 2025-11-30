package com.bank.poc.gateway.dto;

import lombok.Data;

@Data
public class TransactionRequest {
    private String cardNumber;
    private String pin;
    private double amount;
    private String type; // withdraw / topup
}
