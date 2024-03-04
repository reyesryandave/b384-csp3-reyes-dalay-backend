const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../auth");

// [SECTION] User Registration
module.exports.registerUser = (req, res) => {

	if (!req.body.email.includes("@")){
		return res.status(400).send({ error: "Email invalid" });
	}

	else if (req.body.mobileNo.length !== 11){
		return res.status(400).send({ error: "Mobile number invalid" });
	}
	else if (req.body.password.length < 8) {
		return res.status(400).send({ error: "Password must be atleast 8 characters" });

	} else {
		let newUser = new User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			mobileNo: req.body.mobileNo,
			password: bcrypt.hashSync(req.body.password, 10)
		})

		return newUser.save()
		.then((result) => res.status(201).send({ message: "Registered Successfully" }))
		.catch(err => {
			console.error("Error in saving: ", err)
			return res.status(500).send({ error: "Error in save"})
		});
	}

};

module.exports.loginUser = (req, res) => {
	if(req.body.email.includes("@")){
		return User.findOne({ email: req.body.email })
		.then(result => {
			// User does not exist
			if(result == null){
				return res.status(404).send({ error: "No Email Found" });
			} else {
				const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password)
				if(isPasswordCorrect){
					return res.status(200).send({ access: auth.createAccessToken(result) })
				// Password does not match
				} else {
					return res.status(401).send({ message: "Email and password do not match" });
				} 
			}
		})
		.catch(err => {
			console.log("Error in find: ", err);
			res.status(500).send({ error: "Error in find"});
		});
	} else {
		return res.status(400).send({error: "Invalid Email"});
	}
};

module.exports.checkEmailExists = (req, res) => {
	if(req.body.email.includes("@")){
		return User.find({ email: req.body.email })
		.then(result => {
			if(result.length > 0){
				return res.status(409).send({ error: "Duplicate Email Found" });
			} else {
				return res.status(404).send({ message: "Email not found" });
			};
		})
		.catch(err => {
			console.error("Error in find", err)
			return res.status(500).send({ error: "Error in find"});
		});
	} else {
		res.status(400).send({ error: "Invalid Email"});
	}
};

//[SECTION] Retrieve user details
module.exports.getProfile = (req, res) => {

	const userId = req.user.id;

	User.findById(userId)
	.then(user => {
		if (!user) {
			return res.status(404).send({ error: 'User not found' });
		}

		user.password = undefined;

		return res.status(200).send({ user });
	})
	.catch(err => {
		console.error("Error in fetching user profile", err)
		return res.status(500).send({ error: 'Failed to fetch user profile' })
	});
};

// [SECTION] Update password
module.exports.resetPassword = async (req, res) => {
	try {
		const { newPassword } = req.body;
    	const { id } = req.user;

    	// Hash the new password
    	const hashedPassword = await bcrypt.hash(newPassword, 10);

    	await User.findByIdAndUpdate(id, { password: hashedPassword });

    	res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
    	console.error(error);
    	res.status(500).json({ message: 'Internal Server error' });
    }
}

// [SECTION] Update User Admin
module.exports.updateUserAsAdmin = async (req, res) => {
  const { id } = req.body;

  try {
    // Check if the requesting user is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update the user as an admin
    const updatedUser = await User.findByIdAndUpdate(id, { isAdmin: true }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};




