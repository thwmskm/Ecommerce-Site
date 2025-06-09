const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../Models/User');
const Shipping = require('../../Models/Shipping');

//To check user's sign in status using token
exports.authenticateUser = async (req, res) => {
    try{
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ loginStatus: false, message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ loginStatus: false, message: 'User not found' });
        }
        else{
            req.user = user;
            return res.json({ loginStatus: true });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ loginStatus: false, message: 'Invalid token' });
    }
};

//authenticate user after logging in from authentication.html
exports.login = async (req, res) => {
    try {
            const { email, password } = req.body;
    
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ error: "Invalid email or password" });
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid email or password" });
            }
    
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            res.json({ message: "Login successful", token });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
};

//authenticate user after registering from authentication.html
exports.register = async (req, res) => {
    try {
            const { fName, lName, email, password, address, city, prov, country, postalCode, num} = req.body;
    
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: "Email already in use" });
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const user = await User.create({
                fName,
                lName,
                email,
                password: hashedPassword
            });

            const shipping = await Shipping.create({
                street: address,
                zip: postalCode,
                city,
                province: prov,
                country,
                phoneNum: num,
                userId: user.id
            });

            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.status(201).json({ message: "User and Shipping registered successfully", user, shipping, token});

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
};