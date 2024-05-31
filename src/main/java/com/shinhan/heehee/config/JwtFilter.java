package com.shinhan.heehee.config;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.shinhan.heehee.util.JwtUtil;
import com.shinhan.security.CustomUserDetailsService;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
	
	JwtUtil jwtUtil;
	CustomUserDetailsService customUserDetailsService;
	
	
	/*
	 * @Autowired public JwtFilter(@Qualifier("customUserDetailsService")
	 * CustomUserDetailsService customUserDetailsService) { this.jwtUtil = new
	 * JwtUtil(); this.customUserDetailsService = customUserDetailsService; }
	 */
	@Override
	protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain)
			throws ServletException, IOException {
		System.out.println("힝..");
		String authorizationHeader = httpServletRequest.getHeader("Authorization");
		String token = null;
		String userName = null;
		if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
			token = authorizationHeader.substring(7);
			userName = jwtUtil.extractUsername(token);
			System.out.println("이거 타?");
		}
		if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			System.out.println("이것두??");
			UserDetails userDetails = customUserDetailsService.loadUserByUsername(userName);
			if (jwtUtil.validateToken(token, userDetails)) {
				UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
						userDetails, null, userDetails.getAuthorities());
				usernamePasswordAuthenticationToken
						.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpServletRequest));
				SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
			}
		}
		filterChain.doFilter(httpServletRequest, httpServletResponse);

	}

}
