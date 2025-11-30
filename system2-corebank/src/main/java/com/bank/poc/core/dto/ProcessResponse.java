package com.bank.poc.core.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProcessResponse {

    private boolean success;
    private String message;
    private Double balance;      // remaining balance (if relevant)
    private Long transactionId;
}
