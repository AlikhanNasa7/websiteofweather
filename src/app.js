const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const app = express()

//Define paths for Express config
const publicmain = path.join(__dirname,'../public')
const viewspath = path.join(__dirname, '../templates/views')
const partialspath = path.join(__dirname,'../templates/partials')

//Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views',viewspath)
hbs.registerPartials(partialspath)

//Setup static directory to serve

app.use(express.static(publicmain))
app.get('',(req,res)=>{
    res.render('index.hbs',{
        title: 'Weather App',
        name: 'Alikhan'
    })
})
app.get('/about',(req,res)=>{
    res.render('about.hbs',{
        title:'About page',
        name: 'Alikhan'
    })
})
app.get('/help',(req,res)=>{
    res.render('help.hbs',{
        title:'Help page',
        name: 'Alikhan'
    })
})
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        console.log(latitude,longitude)
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products',(req,res)=>{
    if (!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})
app.get('/help/*',(req,res)=>{
    res.render('404.hbs', {
        error: 'Help article not found',
        title:'Help page',
        name: 'Alikhan'
    })
})


app.get('*',(req,res)=>{
    res.render('404.hbs', {
        error: 'Page not found',
        title:'Help page',
        name: 'Alikhan'
    })
})

app.listen(3000, ()=>{
    console.log('Server is up on port 3000!')
})