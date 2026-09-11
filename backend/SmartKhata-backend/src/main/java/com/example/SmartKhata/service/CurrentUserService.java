package com.example.SmartKhata.service;

import com.example.SmartKhata.entity.Shop;
import com.example.SmartKhata.entity.User;
import com.example.SmartKhata.repository.ShopRepository;
import com.example.SmartKhata.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrentUserService {

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;

    public Shop getCurrentShop(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return shopRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
    }
}