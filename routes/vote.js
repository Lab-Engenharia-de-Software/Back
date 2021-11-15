const { application } = require('express')
var express = require('express')
const prisma = require('../utils/prismaDB')
var route = express.Router()


//abrir votação para presidentes

module.exports = route