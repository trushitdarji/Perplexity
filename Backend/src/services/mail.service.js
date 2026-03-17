import nodeMailer from "nodemailer"

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID, 
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

transporter.verify()
.then(()=>{console.log("Email transporter is ready to send emails")})
.catch((err)=>{console.log("Email trnaspoter varification failed",err);
})

export async function sendMail({to,subject,text,html}){
    const mailOptions = {
        from:process.env.GOOGLE_USER,
        to,
        subject,
        text,
        html
    }

    const details = await transporter.sendMail(mailOptions)
    console.log("Email sended: ",details);
    
}
