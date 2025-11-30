package com.bank.poc.core.controller;

import com.bank.poc.core.dto.CardDetailsResponse;
import com.bank.poc.core.dto.ProcessResponse;
import com.bank.poc.core.dto.TransactionRequest;
import com.bank.poc.core.entity.Transaction;
import com.bank.poc.core.service.CardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // Vite default port
public class ProcessingController {

    private final CardService cardService;

    @PostMapping("/process")
    public ProcessResponse processTransaction(@Valid @RequestBody TransactionRequest req) {
        // card prefix "4" was already validated in System 1
        return cardService.process(req);
    }

    @GetMapping("/cards/{cardNumber}")
    public CardDetailsResponse getCardDetails(@PathVariable String cardNumber) {
        return cardService.getCardDetails(cardNumber);
    }

    @GetMapping("/transactions")
    public List<Transaction> getTransactions(
            @RequestParam(required = false) String cardNumber
    ) {
        if (cardNumber != null && !cardNumber.isBlank()) {
            return cardService.getTransactionsByCard(cardNumber);
        }
        return cardService.getAllTransactions();
    }
}
