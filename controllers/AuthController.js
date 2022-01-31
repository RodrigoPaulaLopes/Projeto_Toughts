const User = require('../models/User')
const bcrypt = require('bcryptjs')



module.exports = class AuthController{
    static login(req, res){
        res.render('auth/login')
    }
    static registrar(req, res){
        res.render('auth/registrar')
    }
    static async registrarPost(req, res){
        const  {name, email, senha, ConfirmarSenha} = req.body

        

        if(senha != ConfirmarSenha){
            req.flash('message', 'Senhas não conferem, tente novamente!')
            res.render('auth/registrar')
            return 
        }

        const checarSeUsuarioExiste = await User.findOne({ where: {email: email}})
       
        
        if(checarSeUsuarioExiste){
            req.flash('message', 'Este email já está cadastrado!')
            res.render('auth/registrar')

            return
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(senha, salt)

        const user = {
            name,
            email,
            senha: hashedPassword
        }
        User.create(user)
        .then((user) => {
          // initialize session
          req.session.userid = user.id
  
          // console.log('salvou dado')
          // console.log(req.session.userid)
  
          req.session.userid = user.id
          
  
          req.flash('message', 'Cadastro realizado com sucesso!')
  
          req.session.save(() => {
            res.redirect('/')
          })
        })
        .catch((err) => console.log(err))

        
    }
    static logout(req, res){
       req.session.destroy()
       res.redirect('/login')
    }
    static async loginPost(req, res){
        const {email, senha} = req.body


        const userExists = await User.findOne({where: {email: email}})
       
        if(!userExists){
            req.flash('message', "Email não existe!")
            res.render('auth/login')
            return
        }

        const senhaExiste = bcrypt.compareSync(senha, userExists.senha)

        if(!senhaExiste){
            req.flash('message', "Senha incorreta!")
            res.render('auth/login')
            return
        }

       
            
            
            req.session.userid = userExists.id
           
          
            req.flash('messagem', "login efetuado com sucesso!")
            req.session.save(()=>{
                res.redirect('/')

            })
        
            
            
        
    }
}