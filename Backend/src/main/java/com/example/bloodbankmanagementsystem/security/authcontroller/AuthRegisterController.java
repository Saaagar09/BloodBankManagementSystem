package com.example.bloodbankmanagementsystem.security.authcontroller;

import com.example.bloodbankmanagementsystem.dto.auth.LoginDTO;
import com.example.bloodbankmanagementsystem.dto.auth.RegisterDTO;
import com.example.bloodbankmanagementsystem.security.authservice.AuthRegisterService;
import com.example.bloodbankmanagementsystem.security.jwt.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthRegisterController {

    private final AuthRegisterService authRegisterService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthRegisterController(AuthRegisterService authRegisterService,
                                  AuthenticationManager authenticationManager,
                                  JwtService jwtService) {
        this.authRegisterService = authRegisterService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDTO registerDTO) {
        authRegisterService.register(registerDTO);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginDTO loginDTO) {
        return authRegisterService.login(loginDTO);
    }

}
