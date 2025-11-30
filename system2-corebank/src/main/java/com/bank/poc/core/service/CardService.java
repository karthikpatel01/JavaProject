package com.bank.poc.core.service;

import com.bank.poc.core.dto.CardDetailsResponse;
import com.bank.poc.core.dto.ProcessResponse;
import com.bank.poc.core.dto.TransactionRequest;
import com.bank.poc.core.entity.Card;
import com.bank.poc.core.entity.Transaction;
import com.bank.poc.core.repository.CardRepository;
import com.bank.poc.core.repository.TransactionRepository;
import com.bank.poc.core.util.PinHashUtil;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public ProcessResponse process(TransactionRequest req) {

        // 1. Find card
        Card card = cardRepository.findById(req.getCardNumber())
                .orElse(null);

        if (card == null) {
            Transaction t = createTransaction(req, "FAILED", "Card not found");
            transactionRepository.save(t);
            return new ProcessResponse(false, "Card not found", null, t.getId());
        }

        // 2. Validate PIN (hash)
        String incomingHash = PinHashUtil.hashPin(req.getPin());
        if (!StringUtils.equals(incomingHash, card.getPinHash())) {
            Transaction t = createTransaction(req, "FAILED", "Invalid PIN");
            transactionRepository.save(t);
            return new ProcessResponse(false, "Invalid PIN", card.getBalance(), t.getId());
        }

        // 3. Perform operation
        String type = req.getType().toLowerCase();
        double amount = req.getAmount();

        if (!type.equals("withdraw") && !type.equals("topup")) {
            Transaction t = createTransaction(req, "FAILED", "Invalid type");
            transactionRepository.save(t);
            return new ProcessResponse(false, "Invalid type. Use withdraw/topup", card.getBalance(), t.getId());
        }

        if (amount <= 0) {
            Transaction t = createTransaction(req, "FAILED", "Amount must be > 0");
            transactionRepository.save(t);
            return new ProcessResponse(false, "Amount must be > 0", card.getBalance(), t.getId());
        }

        String message;

        if (type.equals("withdraw")) {
            if (card.getBalance() < amount) {
                Transaction t = createTransaction(req, "FAILED", "Insufficient balance");
                transactionRepository.save(t);
                return new ProcessResponse(false, "Insufficient balance", card.getBalance(), t.getId());
            }
            card.setBalance(card.getBalance() - amount);
            message = "Withdrawal successful";
        } else {
            card.setBalance(card.getBalance() + amount);
            message = "Top-up successful";
        }

        cardRepository.save(card);

        Transaction t = createTransaction(req, "SUCCESS", message);
        transactionRepository.save(t);

        return new ProcessResponse(true, message, card.getBalance(), t.getId());
    }

    private Transaction createTransaction(TransactionRequest req, String status, String reason) {
        Transaction t = new Transaction();
        t.setCardNumber(req.getCardNumber());
        t.setType(req.getType());
        t.setAmount(req.getAmount());
        t.setTimestamp(LocalDateTime.now());
        t.setStatus(status);
        t.setReason(reason);
        return t;
    }

    @Transactional(readOnly = true)
    public CardDetailsResponse getCardDetails(String cardNumber) {
        Card card = cardRepository.findById(cardNumber)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        List<Transaction> txns = transactionRepository
                .findByCardNumberOrderByTimestampDesc(cardNumber);

        CardDetailsResponse resp = new CardDetailsResponse();
        resp.setCardNumber(card.getCardNumber());
        resp.setCustomerName(card.getCustomerName());
        resp.setBalance(card.getBalance());
        resp.setTransactions(txns);
        return resp;
    }

    @Transactional(readOnly = true)
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Transaction> getTransactionsByCard(String cardNumber) {
        return transactionRepository.findByCardNumberOrderByTimestampDesc(cardNumber);
    }
}
