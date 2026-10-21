//package com.feuji.controllerstest;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import com.feuji.commonmodel.User;
//import com.feuji.userservice.controller.UserController;
//import com.feuji.userservice.service.UserService;
//
//@SpringbootT
//public class UserControllerTest {
//
//	@Mock
//	private UserService service;
//
//	@InjectMocks
//	private UserController userController;
//
//	@BeforeEach
//	public void setup() {
//		MockitoAnnotations.openMocks(this);
//	}
//
//	@Test
//	public void testUserRegisteration() {
//		User user = new User();
//		user.setEmail("shaik@gmail.com");
//		user.setPassword("12345678");
//
//		User newUser = userController.registerUser(user);
//
//		assertEquals("shaik@gmail.com", newUser.getEmail());
//		assertEquals("12345678", newUser.getPassword());
//
//	}
//
//}
