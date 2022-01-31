//modulos externos
const express = require('express')
const handlebars = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')
//fim modulos externos
//modulos locais
const conn = require('./db/conn.js')
const Tought = require('./models/Toughts.js')
const User = require('./models/User.js')
const toughtsroutes = require('./routes/toughtsroutes.js')
const authroutes = require('./routes/authroutes.js')
const ToughtController = require('./controllers/ToughtsController.js')

// fim modulos locais

//iniciando express
const app = express()
//fim da iniciação do express


//midllewares
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(
    session({
        name: 'session',
        secret: 'nosso-session',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () {},
            path: require('path').join(require('os').tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    })
)
app.use(flash())

app.use(express.static('public'))

app.use((req, res, next) => {

    if (req.session.userid) {
        res.locals.session = req.session
    }

    next()
})

//routes 

app.use('/toughts', toughtsroutes)
app.use('/', authroutes)
app.use('/', ToughtController.showToughts)
//fim midllewares

conn.sync().then(()=>{
        app.listen(80)
}).catch(err => console.log(err))
