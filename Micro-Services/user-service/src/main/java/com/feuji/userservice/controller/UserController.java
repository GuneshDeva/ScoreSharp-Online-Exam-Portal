package com.feuji.userservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.feuji.commonmodel.Role;
import com.feuji.commonmodel.User;
import com.feuji.userservice.service.UserService;

@RestController
@CrossOrigin("*")
public class UserController {

	@Autowired
	private UserService userService;

	@PostMapping(value = "/registerUser")
	public User registerUser(@RequestBody User user) {
		 if(user.getRole()==null) {
		    	user.setRole(Role.USER);
		    }
		     user.setStatus("active");  
		return userService.createUser(user);
	}

	@PostMapping(value = "/loginUser")
	public User loginUser(@RequestBody User user) {
		return userService.userLogin(user);
	}
	
	@PutMapping(value="/forgotpassword")
	public void forgotPassword(@RequestBody User user ) {
			
	userService.editUser(user);
	}
	@GetMapping(value = "/getUserById/{id}")
	public User getUserById( @PathVariable long id) {
		return userService.getUserById(id);	
	}
	@PostMapping(value = "/getUserById")
	public User getUserById(User user) {
		return userService.getUser(user);	
	}

	@PostMapping(value = "/updateUser")
	public User updateUser(@RequestBody User user) {
		return userService.updateUser(user);	
	}
	@GetMapping(value = "/getallusers")
	public List<User> fetchAllUsers(){
		return userService.fetchAllUsers();

	}

}
