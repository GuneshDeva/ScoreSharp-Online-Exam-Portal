package com.feuji.userservice;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import com.feuji.commonmodel.User;
import com.feuji.userservice.controller.UserController;
import com.feuji.userservice.service.UserService;

@SpringBootTest
public class UserControllerTest {

	@Mock
	private UserService service;

	@InjectMocks
	private UserController userController;

	private User user;

	@BeforeEach
	public void setup() {
//		MockitoAnnotations.openMocks(this);
		user = new User();
	}

	@Test
	public void testUserRegisteration() {

		user.setEmail("shaik@gmail.com");
		user.setPassword("12345678");

		System.out.println(userController.toString());

		when(service.createUser(user)).thenReturn(user);

		when(service.userLogin(user)).thenReturn(user);

		User newUser = userController.registerUser(user);

		User loggedUser = userController.loginUser(user);

		System.out.println(newUser);
		assertEquals("shaik@gmail.com", newUser.getEmail());
		assertEquals("12345678", newUser.getPassword());

		assertEquals("shaik@gmail.com", loggedUser.getEmail());
		assertEquals("12345678", loggedUser.getPassword());
	}

	@Test
	public void testUserLogin() {

		user.setEmail("shaik@gmail.com");
		user.setPassword("12345678");

		System.out.println(userController.toString());

		when(service.userLogin(user)).thenReturn(user);

		User loggedUser = userController.loginUser(user);

		System.out.println(loggedUser);

		assertEquals("shaik@gmail.com", loggedUser.getEmail());
		assertEquals("12345678", loggedUser.getPassword());
	}
}
