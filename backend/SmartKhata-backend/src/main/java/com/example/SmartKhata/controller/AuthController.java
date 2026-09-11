package com.example.SmartKhata.controller;

import com.example.SmartKhata.dto.auth.AuthResponse;
import com.example.SmartKhata.dto.auth.LoginRequest;
import com.example.SmartKhata.dto.auth.RegisterRequest;
import com.example.SmartKhata.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
//@RequestMapping("/auth")
public class AuthController {
  private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/auth/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request){
        return ResponseEntity.ok(userService.register(request));
    }
    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request
    ){

        String token = userService.login(request);

        return ResponseEntity.ok(
                new AuthResponse(token)
        );
    }


    @GetMapping("/test")
    public String test() {
        return "JWT Authentication Working!";
    }
}
