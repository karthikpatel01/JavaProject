package com.bank.poc.core.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Card {

    @Id
    private String cardNumber;    // e.g. "4123456789012345"

    private String pinHash;       // SHA-256 hash

    private double balance;

    private String customerName;
}
