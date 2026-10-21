package com.feuji.userservice.service;

import java.util.List;
import java.util.stream.Collectors;
import com.feuji.commonmodel.User;
import com.feuji.userservice.repository.UserRepository;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.feuji.commonmodel.Role;
import com.feuji.commonmodel.User;
import com.feuji.userservice.repository.UserRepository;

@Service
public class UserService {
	@Autowired
	private UserRepository userRepository;

	// register
	public User createUser(User user) {
		if (user != null) {
			User existUser = userRepository.findByEmail(user.getEmail());

			if (existUser != null) {
				return null;
			} else {

				return userRepository.save(user);
			}

		} else {
			return null;
		}
	}

	// login
	public User userLogin(User user) {
		System.out.print(user.getEmail() + "   " + user.getPassword());
		User userinfo = userRepository.findByEmailAndPassword(user.getEmail(), user.getPassword());

		if (userinfo != null && userinfo.getStatus().equalsIgnoreCase("active")) {
			return userinfo;
		} else {
			return null;
		}
	}

	// update
	public boolean editUser(User user) {
		User editUser = userRepository.findByEmail(user.getEmail());
		if (editUser != null) {
			editUser.setPassword(user.getPassword());
			userRepository.saveAndFlush(editUser);
			return true;
		}
		return false;
	}

	// get by id
	public User getUserById(long id) {

		return userRepository.findById(id).get();
	}

	public User getUser(User user) {

		return userRepository.findById(user.getId()).get();
	}


    public User updateUser(User user) {
		System.out.println(user.getId());
		User user2= userRepository.findById(user.getId()).get();
		if(user2!=null)
		{
			user2.setName(user.getName());
			user2.setEmail(user.getEmail());
			user2.setPhoneNumber(user.getPhoneNumber());
			return userRepository.saveAndFlush(user2);
		}
		else {
			   return user;
		}
	}


	public List<User> fetchAllUsers() {
		List<User> users = userRepository.findAll().stream().filter(e->e.getRole().equals(Role.USER))
				.collect(Collectors.toList());
		return users;
	}

	 public void setUserRepository(UserRepository userRepository) {
	        this.userRepository = userRepository;
	    }


}
