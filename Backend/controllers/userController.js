import { generateToken } from "../config/generateToken.js";
import User from "../models/userModel.js";

const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  console.log(users);
  res.send(users);
};

const registerController = async (req, res) => {
  const { name, email, password ,pic} = req?.body;
  if (!name || !email || !password) {
    res.status(400);
    throw Error("All Field are Required");
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    email,
    name,
    password,
    pic
   
  });

  try {
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      });

    } else {
      res.status(400);
      throw new Error("User not found");
    }
  } catch (error) {
    res.send({ error });
  }
};
const loginController = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  console.log(user);

  // const newPass = await user.matchPassword(password);
  // console.log("newPass", newPass);

  if (user && (await user.matchPassword(password))) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
};

export { registerController, loginController, allUsers };
