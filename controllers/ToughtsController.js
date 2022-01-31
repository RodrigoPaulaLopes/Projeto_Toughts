const Toughts = require('../models/Toughts.js')
const User = require('../models/User.js')

const {Op} = require('sequelize')

module.exports = class ToughtController {
    static async showToughts(req, res) {


        let search = ''

        if(req.query.search){
            search = req.query.search
        }

        let order = 'DESC'

        if(req.query.order === 'old'){
            order = 'ASC'
        }else{
            order = 'DESC'
        }

        const pensamentosData = await Toughts.findAll({
            include: User,
            where: {
                title: {[Op.like]: `%${search}%`}
            },
            order: [['createdAt', order]]
        })

         const pensamento = pensamentosData.map((result) => result.get({plain: true}))
        
         let pensamentoQtde = pensamento.length
        

        res.render('toughts/home', {pensamento, search, pensamentoQtde})
    }
    static async dashboard(req, res) {

        const userid = req.session.userid

        const user = await User.findOne(
            {
                where: {
                    id: userid
                },
                include: Toughts,
                plain: true,
            }
        )





        if (!user) {
            res.redirect('/login')
        }
        const toughts = user.toughts.map((result) => result.dataValues)

        let emptyToughts = false

        if (toughts.length === 0) {
            emptyToughts = true
        }



        res.render('toughts/dashboard', { toughts, emptyToughts })
    }

    static registrarPensamentos(req, res) {

        res.render('toughts/pensamentos-form')
    }
    static async registrarEditarPensamentosPost(req, res) {

        if (req.body.id) {

            

            const id = req.body.id
            const tought = {
                title: req.body.title,
                UserId: req.session.userid
            }

            try {
                await Toughts.update(tought, {where: {id: id}})

                req.flash('message', 'pensamento criado com sucesso!')

                req.session.save(() => {
                    res.redirect('/toughts/dashboard')

                })

            } catch (error) {
                console.log(error);
            }

        } else {



            const tought = {
                title: req.body.title,
                UserId: req.session.userid
            }

            try {
                await Toughts.create(tought)

                req.flash('message', 'pensamento criado com sucesso!')

                req.session.save(() => {
                    res.redirect('/toughts/dashboard')

                })

            } catch (error) {
                console.log(error);
            }
        }



    }
    static async removerPensamentos(req, res) {

        const id = req.body.id
        const userId = req.session.userid


        try {
            await Toughts.destroy({ where: { id: id, userId: userId } })

            req.flash('message', 'Pensamento removido!')

            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (error) {
            console.log(`erro: ${error}`);
        }
    }
    static async buscarPensamento(req, res) {
        const id = req.params.id

        const pensamento = await Toughts.findOne({ raw: true, where: { id: id } })
        console.log(`Pensamento: ${pensamento}`);
        res.render('toughts/pensamentos-form', { pensamento })
    }

}   