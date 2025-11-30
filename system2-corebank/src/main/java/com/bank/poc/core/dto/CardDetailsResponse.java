package com.bank.poc.core.dto;

import com.bank.poc.core.entity.Transaction;
import lombok.Data;

import java.util.List;

@Data
public class CardDetailsResponse {

    private String cardNumber;
    private String customerName;
    private double balance;
    private List<Transaction> transactions;
}
