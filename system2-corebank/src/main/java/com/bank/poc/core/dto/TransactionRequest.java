package com.bank.poc.core.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TransactionRequest {

    @NotBlank
    private String cardNumber;

    @NotBlank
    private String pin;          // plain text from client, never stored

    @Min(0)
    private double amount;

    @NotBlank
    private String type;         // "withdraw" or "topup"
}
