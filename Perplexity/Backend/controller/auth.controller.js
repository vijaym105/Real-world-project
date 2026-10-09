import userModel from '../models/user.model.js';
import { sendEmail } from '../services/mail.service.js';
import jwt from 'jsonwebtoken';


export const register = async (req, res) => {

    const { username, email, password } = req.body

    const isUserExists = await userModel.findOne({
        $or: [{ username }, { email }]
    })

    if (isUserExists) {
        return res.status(400).json({
            message: `Username or email already exists`,
            success: false
        })
    }

    const user = await userModel.create({
        username,
        email,
        password
    })

    const emailVerToken = jwt.sign(
        {
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '15m'
        }
    );

    await sendEmail(
        email,
        "Verify your Perplexity account",
        `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your Perplexity account</title>
</head>

<body style="
    margin: 0;
    padding: 0;
    background-color: #f3f6f7;
    font-family: Arial, Helvetica, sans-serif;
">

    <!-- Main wrapper -->
    <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="
            background-color: #f3f6f7;
            padding: 40px 15px;
        "
    >
        <tr>
            <td align="center">

                <!-- Email container -->
                <table
                    width="600"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                        max-width: 600px;
                        width: 100%;
                        background-color: #ffffff;
                        border-radius: 18px;
                        overflow: hidden;
                    "
                >

                    <!-- ================= HEADER ================= -->

                    <tr>
                        <td
                            align="center"
                            style="
                                background-color: #071013;
                                padding: 40px 30px;
                            "
                        >

                            <div style="
                                font-size: 32px;
                                font-weight: 700;
                                color: #ffffff;
                                letter-spacing: -1px;
                            ">
                                ✦ Perplexity
                            </div>

                            <div style="
                                margin-top: 10px;
                                font-size: 15px;
                                color: #aeb8bd;
                            ">
                                Search Smarter. Think Deeper.
                            </div>

                        </td>
                    </tr>


                    <!-- ================= CONTENT ================= -->

                    <tr>
                        <td
                            style="
                                padding: 45px 40px;
                            "
                        >

                            <!-- Greeting -->

                            <h1 style="
                                margin: 0 0 20px 0;
                                color: #172b3a;
                                font-size: 32px;
                                line-height: 1.2;
                                font-weight: 700;
                            ">
                                Hello ${username},
                            </h1>


                            <!-- Message -->

                            <p style="
                                margin: 0 0 20px 0;
                                color: #34495e;
                                font-size: 17px;
                                line-height: 1.7;
                            ">
                                Thank you for registering with
                                <strong style="color: #172b3a;">
                                    Perplexity
                                </strong>.
                                We're excited to have you on board.
                            </p>


                            <p style="
                                margin: 0 0 30px 0;
                                color: #34495e;
                                font-size: 17px;
                                line-height: 1.7;
                            ">
                                Please verify your email address to activate
                                your account and start exploring a smarter
                                way to search.
                            </p>


                            <!-- ================= BUTTON ================= -->

                            <table
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                            >
                                <tr>
                                    <td align="center">

                                        <a
                                            href="http://localhost:3000/api/auth/verify-email?token=${emailVerToken}"
                                            style="
                                                display: inline-block;
                                                background-color: #071013;
                                                color: #ffffff;
                                                text-decoration: none;
                                                font-size: 16px;
                                                font-weight: 700;
                                                padding: 17px 42px;
                                                border-radius: 10px;
                                            "
                                        >
                                            Verify Email &nbsp; →
                                        </a>

                                    </td>
                                </tr>
                            </table>


                            <!-- ================= EXPIRY BOX ================= -->

                            <table
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                style="
                                    margin-top: 35px;
                                    background-color: #effaf5;
                                    border: 1px solid #ccefe0;
                                    border-radius: 12px;
                                "
                            >
                                <tr>

                                    <td
                                        width="65"
                                        align="center"
                                        valign="middle"
                                        style="
                                            padding: 20px 5px 20px 15px;
                                        "
                                    >

                                        <div style="
                                            width: 40px;
                                            height: 40px;
                                            line-height: 40px;
                                            background-color: #d9f6e8;
                                            border-radius: 50%;
                                            font-size: 20px;
                                        ">
                                            ✓
                                        </div>

                                    </td>

                                    <td
                                        valign="middle"
                                        style="
                                            padding: 20px 15px 20px 5px;
                                        "
                                    >

                                        <div style="
                                            color: #176b4c;
                                            font-size: 16px;
                                            font-weight: 700;
                                            margin-bottom: 5px;
                                        ">
                                            This link will expire in 15 minutes.
                                        </div>

                                        <div style="
                                            color: #527166;
                                            font-size: 14px;
                                            line-height: 1.5;
                                        ">
                                            For your security, please complete
                                            the verification within this time.
                                        </div>

                                    </td>

                                </tr>
                            </table>


                            <!-- ================= SECURITY MESSAGE ================= -->

                            <div style="
                                margin-top: 35px;
                                padding-top: 25px;
                                border-top: 1px solid #e5e7eb;
                            ">

                                <p style="
                                    margin: 0;
                                    color: #667085;
                                    font-size: 14px;
                                    line-height: 1.7;
                                ">
                                    If you didn't create a Perplexity account,
                                    you can safely ignore this email.
                                    Your account won't be activated.
                                </p>

                            </div>


                            <!-- ================= SIGNATURE ================= -->

                            <div style="
                                margin-top: 28px;
                            ">

                                <p style="
                                    margin: 0 0 5px 0;
                                    color: #52606d;
                                    font-size: 15px;
                                ">
                                    Best regards,
                                </p>

                                <p style="
                                    margin: 0;
                                    color: #172b3a;
                                    font-size: 16px;
                                    font-weight: 700;
                                ">
                                    The Perplexity Team
                                </p>

                            </div>

                        </td>
                    </tr>


                    <!-- ================= FOOTER ================= -->

                    <tr>
                        <td
                            align="center"
                            style="
                                background-color: #f8fafb;
                                border-top: 1px solid #e5e7eb;
                                padding: 28px 30px;
                            "
                        >

                            <p style="
                                margin: 0 0 15px 0;
                                color: #667085;
                                font-size: 14px;
                            ">
                                Curious minds build a better tomorrow.
                            </p>

                            <p style="
                                margin: 0;
                                color: #8a949e;
                                font-size: 13px;
                            ">
                                For help, contact us at
                                <a
                                    href="mailto:vjmalusare10@gmail.com"
                                    style="
                                        color: #1677ff;
                                        text-decoration: none;
                                    "
                                >
                                    vjmalusare10@gmail.com
                                </a>
                            </p>

                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
`
    );

    res.status(201).json({
        message: 'User created successfully',
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

export const login = async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: 'User not found',
            err: "email not found",
            success: false
        })
    }

    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: 'Invalid email or password',
            err: "invalid credentials",
            success: false
        })
    }

    if (!user.verified) {
        return res.status(400).json({
            message: 'Please verify your email before logging in',
            err: "email not verified",
            success: false
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email
    }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie('token', token)

    res.status(200).json({
        message: 'User logged in successfully',
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    })
}

export const getMe = async (req, res) => {
    const userId = req.user.id

    const user = await userModel.findById(userId).select('-password')

    if (!user) {
        return res.status(404).json({
            message: 'User not found',
            success: false
        })
    }

    res.status(200).json({
        message: 'User information retrieved successfully',
        success: true,
        user
    })
}
export const verifyEmail = async (req, res) => {
    const { token } = req.query;
    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findOne({ email: decoded.email })

        if (!user) {
            return res.status(400).json({
                message: 'Invalid token',
                success: false
            })
        }

        user.verified = true;
        await user.save();

        const html = `
        <h1>Email Verified</h1>
        <p>Your email has been successfully verified. You can now log in to your account.</p>
        <a href=" http://localhost:5173/login">Login</a>
        `;

        return res.status(200).send(html);

    } catch (err) {
        return res.status(400).json({
            message: 'Invalid token',
            success: false
        })
    }
}

