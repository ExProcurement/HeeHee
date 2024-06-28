package com.shinhan.heehee.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.shinhan.heehee.service.TestService;

@Controller
public class HomeController {
	
	@Autowired
	TestService testService;
	
	@GetMapping("/home")
	public String home() {
		System.out.println(testService.test());
		return "home";
	}
}