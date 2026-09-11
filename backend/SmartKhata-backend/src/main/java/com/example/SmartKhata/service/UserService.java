package com.example.SmartKhata.service;

import com.example.SmartKhata.dto.auth.LoginRequest;
import com.example.SmartKhata.dto.auth.RegisterRequest;
import com.example.SmartKhata.entity.Shop;
import com.example.SmartKhata.entity.User;
import com.example.SmartKhata.repository.ShopRepository;
import com.example.SmartKhata.repository.UserRepository;
import com.example.SmartKhata.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
 private final UserRepository userRepository;
 private final PasswordEncoder passwordEncoder;
 private final ShopRepository shopRepository;
 private final JwtUtil jwtUtil;
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, ShopRepository shopRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.shopRepository = shopRepository;
        this.jwtUtil = jwtUtil;
    }

    public String register(RegisterRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already exits");
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        Shop shop = Shop.builder()
                .shopName(request.getShopName())
                .phone(request.getShopPhone())
                .address(request.getShopAddress())
                .user(user)
                .build();

        shopRepository.save(shop);

        return " Registration successfully";
    }


    public String login(LoginRequest request){
        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(()-> new RuntimeException("User not found"));

        if(!passwordEncoder.matches(
                request.getPassword(),user.getPassword()
        )){
            throw new RuntimeException("Invalid password");
        }
        return jwtUtil.generateToken(request.getEmail());
    }
}
