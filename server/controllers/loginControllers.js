const Profile = require("../models/models.js");
const loginControllers = {};
const { jwtDecode } = require("jwt-decode");
const bcrypt = require("bcryptjs");

// Log in user
loginControllers.verifyUser = async (req, res, next) => {
  console.log("* Handling logging user in...");
  // console.log(req.body.googleIdToken, 'request.params in verifyUser');
  try {
    let decoded;
    if (req.body.googleOauth) {

      const { googleIdToken, profileType } = req.body.googleOauth;

      decoded = jwtDecode(googleIdToken);
      req.body.email = decoded.email;
      req.body.password = decoded.sub;
      req.body.profileType = profileType;
    }

    const { email, password, profileType } = req.body;

    if ((!email, !password)) {
      const missingFieldsErr = {
        log: "Express error handler caught loginControllers.verifyUser error",
        status: 400,
        message: { err: "Missing required fields" },
      };
      return next(missingFieldsErr);
    }

    // Find user in db
    const foundUser = await Profile.User.findOne({ email: email });
    let foundGoogleUser;
    if (foundUser) console.log("  - User found in db: ", foundUser);
    else if (!foundUser && req.body.googleOauth){
      const newUser = new Profile.User({
        email: email,
        password: password,
        profileType: profileType,
      });
      const registeredUser = await newUser.save();
      console.log('Googleuser successfully created in DB');
      res.locals._id = registeredUser._id;
      foundGoogleUser = await Profile.User.findOne({email: email});
      if (foundGoogleUser) console.log(" - Google User found in db: ", foundGoogleUser)
    } 
    else {
      const userDneErr = {
        log: "Express error handler caught loginControllers.verifyUser error",
        status: 400,
        message: { err: "Email does not exist in db" },
      };
      return next(userDneErr);
    }
    console.log('hi this is the users password', password);
    // Compare user entered password w/ password in db
    let passwordFind;
    if (foundGoogleUser) {
      passwordFind = foundGoogleUser.password;
    } else {
      passwordFind = foundUser.password
    }
    const validPassword = await bcrypt.compare(password, passwordFind);
    console.log('valid password? ', validPassword)
    if (validPassword) {
      console.log("  - Valid passowrd entered: ", passwordFind);
      // Store email and account type to be passed on
      if (foundGoogleUser) {
        res.locals.userEmail = foundGoogleUser.email;
        res.locals.profileType = foundGoogleUser.profileType
      } else {
        res.locals.userEmail = foundUser.email;
        res.locals.profileType = foundUser.profileType;
      } 
      return next();
    } else {
      const invalidPasswordErr = {
        log: "Express error handler caught loginControllers.loginUser error",
        status: 400,
        message: { err: "Invalid password entered" },
      };
      return next(invalidPasswordErr);
    }
  } catch (err) {
    return next("Error in loginControllers.verifyUser: " + JSON.stringify(err));
  }
};

// Verify if the logged in user has an Adopter profile or Cat profile
loginControllers.verifyAdopterOrCat = async (req, res, next) => {
  console.log(
    "* Handling verifying if user has created an adopter profile or cat profile yet..."
  );

  try {
    const userEmail = res.locals.userEmail;
    const profileType = res.locals.profileType;
    console.log(
      "  - Seaching Adopter and Cat Profile DBs for: ",
      userEmail,
      profileType
    );

    if (profileType === "Adopter") {
      // Check the adopter profile db for the email
      const foundAdopter = await Profile.Adopter.findOne({ email: userEmail });
      if (foundAdopter) {
        console.log("  - Profile found in Adopter profile db: ", foundAdopter);
        res.locals.hasAdopterOrCatProfile = true;
        return next();
      } else {
        console.log("  - User has not created an Adopter profile");
        res.locals.hasAdopterOrCatProfile = false;
        return next();
      }
    } else if (profileType === "Cat") {
      // Check the cat profile db for the email
      const foundCat = await Profile.Cat.findOne({ email: userEmail });
      if (foundCat) {
        console.log("  - Profile found in Cat profile db: ", foundCat);
        res.locals.hasAdopterOrCatProfile = true;
        return next();
      } else {
        console.log("  - User has not created a Cat profile");
        res.locals.hasAdopterOrCatProfile = false;
        return next();
      }
    }
  } catch (err) {
    return next(
      "Error in loginController.verifyAdopterOrCat: ",
      +JSON.stringify(err)
    );
  }
};

loginControllers.getAccountType = async (req, res, next) => {
  console.log("* Handling getting account type of user...");

  try {
    const { email } = req.body;

    const foundUser = await Profile.User.findOne({ email: email });
    res.locals.accountType = foundUser.profileType;
    return next();
  } catch (err) {
    return next(
      "Error in loginControllers.getAccountType: " + JSON.stringify(err)
    );
  }
};

// Register adopter profile
loginControllers.createAdopter = async (req, res, next) => {
  console.log("* Handling creating an adopter profile for user...");

  const { email, name, aboutMe, imageUrl, profession, experience } = req.body;

  // Handle missing fields - ignores missing imageUrl field
  if (!email || !name || !aboutMe || !profession || !experience) {
    const missingFieldsErr = {
      log: "Express error handler caught loginControllers.createAdopter error",
      status: 400,
      message: { err: "Missing required fields" },
    };
    return next(missingFieldsErr);
  }

  try {
    // Create new adopter from info provided in req body
    const newAdopter = new Profile.Adopter({
      email,
      name,
      aboutMe,
      imageUrl,
      profession,
      experience,
    });

    // Save adopter to 'adopters' db
    const registeredAdopter = await newAdopter.save();
    console.log("* Adopter successfully saved to db: ", registeredAdopter);
    res.locals._id = registeredAdopter._id;
    return next();
  } catch (err) {
    return next(
      "Error in loginControllers.createAdopter: " + JSON.stringify(err)
    );
  }
};

// Register cat profile
loginControllers.createCat = async (req, res, next) => {
  console.log("* Handling creating an cat profile for user...");

  const { email, name, breed, age, aboutMe, imageUrl } = req.body;

  // Handle missing fields - ignores missing imageUrl field
  if (!email || !name || !breed || !age || !aboutMe) {
    const missingFieldsErr = {
      log: "Express error handler caught loginControllers.createCat error",
      status: 400,
      message: { err: "Missing required fields" },
    };
    return next(missingFieldsErr);
  }

  try {
    // Create new adopter from info provided in req body
    const newCat = new Profile.Cat({
      email,
      name,
      breed,
      age,
      aboutMe,
      imageUrl,
    });

    // Save adopter to 'adopters' db
    const registeredCat = await newCat.save();
    console.log("* Cat successfully saved to db: ", registeredCat);
    res.locals._id = registeredCat._id;
    return next();
  } catch (err) {
    return next("Error in loginControllers.createCat: " + JSON.stringify(err));
  }
};

module.exports = loginControllers;
