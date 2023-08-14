const nodeMailer=require("nodemailer");


const sendEmail=async (option)=>{

    const transporter=nodeMailer.createTransport({
        service:process.env.SMPT_SERVICE,
        auth:{
            user:process.env.SMPT_MAIL,  //smpt means simple mail transfer protocall
            pass:process.env.SMPT_PASSWord,
        }
    })
    const mailOption={
        from:"",
        to:SchemaTypeOptions.email,
        subject:SchemaTypeOptions.subject,
        text:SchemaTypeOptions.message,

    };

    await transporter.sendMail(mailOption);
};

module.exports=sendEmail;